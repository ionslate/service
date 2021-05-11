import { QueryOrder } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Page, paginateEntites } from '@root/utils';
import {
  ChangePasswordRequest,
  UserRequest,
  UserSearch,
} from '@root/__generatedTypes__';
import { UserEntity } from '@users/entities/UserEntity';
import bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';
import { RedisStore } from 'connect-redis';
import { Forbidden } from '@error/exceptions/Forbidden';

const ONE_HOUR = 3600000;

export class UserService {
  constructor(
    private userRepository: EntityRepository<UserEntity>,
    private sessionStore: RedisStore,
  ) {}

  async createUser(request: UserRequest): Promise<UserEntity> {
    const password = request.password
      ? await bcrypt.hash(request.password, 10)
      : null;

    const userEntity = this.userRepository.create({
      username: request.username,
      password,
      email: request.email,
      roles: ['USER'],
    });

    if (!password) {
      userEntity.assign(
        {
          reset: {
            resetExipration: Date.now() + ONE_HOUR,
            resetId: uuid(),
          },
        },
        { mergeObjects: true },
      );
    }

    await this.userRepository.persistAndFlush(userEntity);

    return userEntity;
  }

  async updateUser(userId: string, request: UserRequest): Promise<UserEntity> {
    const userEntity = await this.userRepository.findOneOrFail({ id: userId });

    userEntity.assign({
      username: request.username,
      email: request.email,
    });

    if (request.password) {
      const password = await bcrypt.hash(request.password, 10);
      userEntity.assign({ password });
    }

    await this.userRepository.persistAndFlush(userEntity);

    return userEntity;
  }

  private removeSession = (sid: string) =>
    new Promise((resolve, reject) => {
      this.sessionStore.destroy(sid, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(undefined);
        }
      });
    });

  private findUserSession = (userId: string) =>
    new Promise<string | undefined>((resolve, reject) => {
      if (!this.sessionStore.all) {
        return reject(new Error('session store not initialized'));
      }
      this.sessionStore.all((err, sessions) => {
        if (err) {
          return reject(err);
        }

        if (!Array.isArray(sessions)) {
          return resolve(undefined);
        }

        const userSession = sessions.find(
          (session) => session.user.id === userId,
        );

        resolve(userSession?.id);
      });
    });

  async removeUser(userId: string): Promise<string> {
    const userEntity = await this.userRepository.findOneOrFail({ id: userId });

    const sid = await this.findUserSession(userId);
    if (sid) {
      await this.removeSession(sid);
    }

    await this.userRepository.removeAndFlush(userEntity);

    return userId;
  }

  async disableUser(userId: string): Promise<string> {
    const userEntity = await this.userRepository.findOneOrFail({ id: userId });

    userEntity.assign({ active: false });

    const sid = await this.findUserSession(userId);
    if (sid) {
      await this.removeSession(sid);
    }

    await this.userRepository.persistAndFlush(userEntity);

    return userId;
  }

  async enableUser(userId: string): Promise<string> {
    const userEntity = await this.userRepository.findOneOrFail({ id: userId });

    userEntity.assign({ active: true });

    await this.userRepository.persistAndFlush(userEntity);

    return userId;
  }

  async changeUserPassword(
    userId: string,
    request: ChangePasswordRequest,
  ): Promise<boolean> {
    const userEntity = await this.userRepository.findOneOrFail({
      id: userId,
    });

    if (!userEntity.password) {
      throw new Forbidden();
    }

    const isValid = await bcrypt.compare(
      request.oldPassword,
      userEntity.password,
    );

    if (!isValid) {
      throw new Forbidden();
    }

    const password = await bcrypt.hash(request.newPassword, 10);

    userEntity.assign({ password });

    await this.userRepository.persistAndFlush(userEntity);

    return isValid;
  }

  async getUserById(userId: string): Promise<UserEntity> {
    return await this.userRepository.findOneOrFail({ id: userId });
  }

  async getUsersList(
    search?: UserSearch,
    page?: number,
    limit?: number,
  ): Promise<Page<UserEntity>> {
    const [userEntities, count] = await this.userRepository.findAndCount(
      {
        username: search?.username
          ? { $ilike: `%${search.username}%` }
          : undefined,
        email: search?.email ? { $ilike: `%${search.email}%` } : undefined,
      },
      {
        orderBy: { username: QueryOrder.ASC },
        limit,
        offset: page,
      },
    );

    return paginateEntites(userEntities, count, page, limit);
  }
}
