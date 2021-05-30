import { QueryOrder } from '@mikro-orm/core';
import {
  EntityManager,
  EntityRepository,
  PostgreSqlDriver,
} from '@mikro-orm/postgresql';
import { Page, paginateEntites } from '@root/utils';
import {
  ChangePasswordRequest,
  UserAdminRequest,
  UserRequest,
  UserRole,
  UserSearch,
} from '@root/__generatedTypes__';
import { UserEntity } from '@users/entities/UserEntity';
import bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';
import { RedisStore } from 'connect-redis';
import { Forbidden } from '@error/exceptions/Forbidden';
import { BadRequest } from '@error/exceptions/BadRequest';
import userAdminRequestSchema from '../validation/userAdminRequestSchema';
import changePasswordRequestSchema from '../validation/changePasswordRequestSchema';

const ONE_HOUR = 3600000;

export class UserService {
  constructor(
    private userRepository: EntityRepository<UserEntity>,
    private sessionStore: RedisStore,
    private entityManager: EntityManager<PostgreSqlDriver>,
  ) {}

  private async verifyUsernameAndEmailUnique(
    username: string,
    email: string,
    existingUserId?: string,
  ) {
    const qb = this.entityManager.createQueryBuilder(UserEntity);

    const userEntities = await qb
      .orWhere({ username })
      .orWhere({ email })
      .getResult();

    const isUsernameTaken = userEntities.some(
      (user) => user.username === username && user.id !== existingUserId,
    );

    if (isUsernameTaken) {
      throw new BadRequest({
        field: 'username',
        message: 'Username already exists.',
      });
    }

    const isEmailTaken = userEntities.some(
      (user) => user.email === email && user.id !== existingUserId,
    );

    if (isEmailTaken) {
      throw new BadRequest({
        field: 'email',
        message: 'Email already exists.',
      });
    }
  }

  async adminCreateUser(request: UserAdminRequest): Promise<UserEntity> {
    await userAdminRequestSchema.validate(request);
    await this.verifyUsernameAndEmailUnique(request.username, request.email);

    const password = request.password
      ? await bcrypt.hash(request.password, 10)
      : null;

    const userEntity = this.userRepository.create({
      username: request.username.trim(),
      password,
      email: request.email.trim(),
      roles: request.roles,
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

  async createUser(request: UserRequest): Promise<UserEntity> {
    const userEntity = await this.adminCreateUser({
      ...request,
      roles: ['USER'],
    });

    return userEntity;
  }

  async updateUser(
    userId: string,
    request: UserAdminRequest,
    logUserOut: boolean,
  ): Promise<UserEntity> {
    await userAdminRequestSchema.validate(request);
    const userEntity = await this.userRepository.findOneOrFail({ id: userId });

    userEntity.assign({
      username: request.username,
      email: request.email,
      roles: request.roles,
    });

    if (request.password) {
      const password = await bcrypt.hash(request.password, 10);
      userEntity.assign({ password });
    }

    await this.userRepository.persistAndFlush(userEntity);

    if (logUserOut || request.password) {
      const userSession = await this.findUserSession(userId);
      if (userSession) {
        this.removeSession(userSession);
      }
    }

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

  async forceLogoutUser(userId: string): Promise<string | null> {
    const sid = await this.findUserSession(userId);
    if (sid) {
      await this.removeSession(sid);
      return userId;
    }

    return null;
  }

  async changeUserPassword(
    userId: string,
    request: ChangePasswordRequest,
  ): Promise<boolean> {
    await changePasswordRequestSchema.validate(request);

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

  private createUserListQueryBuilder({
    username,
    email,
    role,
    active,
  }: {
    username?: string | null;
    email?: string | null;
    role?: UserRole | null;
    active?: boolean | null;
  }) {
    const qb = this.entityManager.createQueryBuilder(UserEntity);

    if (username) {
      qb.orWhere({ username: { $ilike: `%${username}%` } });
    }

    if (email) {
      qb.orWhere({ email: { $ilike: `%${email}%` } });
    }

    if (role) {
      qb.andWhere({ roles: { $contains: `{${role}}` } });
    }

    if (typeof active === 'boolean') {
      qb.andWhere({ active });
    }

    return qb;
  }

  private async findUsersBySearchParams(
    {
      username,
      email,
      role,
      active,
    }: {
      username?: string | null;
      email?: string | null;
      role?: UserRole | null;
      active?: boolean | null;
    },
    page?: number,
    limit?: number,
  ) {
    const searchQueryBuilder = this.createUserListQueryBuilder({
      username,
      email,
      role,
      active,
    })
      .orderBy({ username: QueryOrder.ASC })
      .limit(limit)
      .offset(page && limit ? page * limit : undefined);

    const userEntities = await searchQueryBuilder.getResult();

    const countQueryBuilder = this.createUserListQueryBuilder({
      username,
      email,
      role,
      active,
    }).count();

    const [{ count }] = await countQueryBuilder.execute();

    return paginateEntites(userEntities, count, page, limit);
  }

  async getUsersList(
    search?: UserSearch,
    page?: number,
    limit?: number,
  ): Promise<Page<UserEntity>> {
    if (search?.searchTerm) {
      return await this.findUsersBySearchParams(
        {
          username: search.searchTerm,
          email: search.searchTerm,
          role: search.role,
          active: search.active,
        },
        page,
        limit,
      );
    }

    return await this.findUsersBySearchParams(
      {
        username: search?.username,
        email: search?.email,
        role: search?.role,
        active: search?.active,
      },
      page,
      limit,
    );
  }
}
