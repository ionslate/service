import { BadRequest } from '@error/exceptions/BadRequest';
import { NotAuthorized } from '@error/exceptions/NotAuthorized';
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
import changePasswordRequestSchema from '@users/validation/changePasswordRequestSchema';
import resetPasswordRequestSchema from '@users/validation/resetPasswordRequestSchema';
import resetPasswordSchema from '@users/validation/resetPasswordSchema';
import userAdminRequestSchema from '@users/validation/userAdminRequestSchema';
import bcrypt from 'bcryptjs';
import { RedisStore } from 'connect-redis';
import { v4 as uuid } from 'uuid';
import { AuditService } from '@audit/services/AuditService';

const ONE_HOUR_IN_MS = 3600000;

export class UserService {
  constructor(
    private userRepository: EntityRepository<UserEntity>,
    private sessionStore: RedisStore,
    private entityManager: EntityManager<PostgreSqlDriver>,
    private auditService: AuditService,
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
            resetExipration: Date.now() + ONE_HOUR_IN_MS,
            resetId: uuid(),
          },
        },
        { mergeObjects: true },
      );
    }

    await this.userRepository.persistAndFlush(userEntity);

    await this.auditService.addCreateAudit({
      entityName: UserEntity.name,
      resourceId: userEntity.id,
      resourceName: userEntity.username,
      data: userEntity.toPOJO(),
    });

    return userEntity;
  }

  async createUser(request: UserRequest): Promise<UserEntity | null> {
    try {
      const userEntity = await this.adminCreateUser({
        username: request.username,
        email: request.email,
        roles: ['USER'],
      });

      // TODO send verification email

      return userEntity;
    } catch (e) {
      if (e instanceof BadRequest) {
        const userEntity = await this.userRepository.findOne({
          email: request.email,
          active: true,
        });

        if (userEntity && userEntity.active) {
          const resetId = uuid();

          userEntity.assign(
            {
              reset: {
                resetExpiration: `${Date.now() + ONE_HOUR_IN_MS}`,
                resetId,
              },
            },
            { mergeObjects: true },
          );

          // TODO send email with reset

          await this.userRepository.persistAndFlush(userEntity);
        } else if (userEntity && !userEntity.active) {
          // TODO send email telling user acount is inactive
        }

        return null;
      }

      throw e;
    }
  }

  async updateUser(
    userId: string,
    request: UserAdminRequest,
    logUserOut: boolean,
  ): Promise<UserEntity> {
    await userAdminRequestSchema.validate(request);
    const userEntity = await this.userRepository.findOneOrFail({ id: userId });
    const originalUser = userEntity.toPOJO();

    userEntity.assign({
      username: request.username,
      email: request.email,
      roles: request.roles,
    });

    if (request.password) {
      const password = await bcrypt.hash(request.password, 10);
      userEntity.assign({ password });
    }

    await this.auditService.addUpdateAudit({
      entityName: UserEntity.name,
      resourceId: userEntity.id,
      resourceName: originalUser.username,
      originalValue: originalUser,
      newValue: userEntity.toPOJO(),
    });

    await this.userRepository.persistAndFlush(userEntity);

    if (logUserOut || request.password) {
      const userSession = await this.findUserSession(userId);
      if (userSession) {
        await this.removeSession(userSession);

        await this.auditService.addCustomAudit({
          action: 'logged out',
          entityName: UserEntity.name,
          resourceId: userEntity.id,
          resourceName: userEntity.username,
        });
      }

      if (request.password) {
        await this.auditService.addCustomAudit({
          action: 'changed password for',
          entityName: UserEntity.name,
          resourceId: userEntity.id,
          resourceName: userEntity.username,
        });
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

    await this.auditService.addDeleteAudit({
      entityName: UserEntity.name,
      resourceId: userEntity.id,
      resourceName: userEntity.username,
    });

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

    await this.auditService.addCustomAudit({
      action: 'disabled',
      entityName: UserEntity.name,
      resourceId: userEntity.id,
      resourceName: userEntity.username,
    });

    return userId;
  }

  async enableUser(userId: string): Promise<string> {
    const userEntity = await this.userRepository.findOneOrFail({ id: userId });

    userEntity.assign({ active: true });

    await this.userRepository.persistAndFlush(userEntity);

    await this.auditService.addCustomAudit({
      action: 'enabled',
      entityName: UserEntity.name,
      resourceId: userEntity.id,
      resourceName: userEntity.username,
    });

    return userId;
  }

  async forceLogoutUser(userId: string): Promise<string | null> {
    const userEntity = await this.userRepository.findOneOrFail({
      id: userId,
    });

    const sid = await this.findUserSession(userId);
    if (sid) {
      await this.removeSession(sid);

      await this.auditService.addCustomAudit({
        action: 'logged out',
        entityName: UserEntity.name,
        resourceId: userEntity.id,
        resourceName: userEntity.username,
      });

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
      throw new NotAuthorized();
    }

    const isValid = await bcrypt.compare(
      request.oldPassword,
      userEntity.password,
    );

    if (!isValid) {
      throw new NotAuthorized();
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

  async resetPasswordRequest(email: string): Promise<void> {
    await resetPasswordRequestSchema.validate({ email });

    const userEntity = await this.userRepository.findOne({
      email,
    });

    if (userEntity && userEntity.active) {
      const resetId = uuid();

      userEntity.assign(
        {
          reset: {
            resetExpiration: `${Date.now() + ONE_HOUR_IN_MS}`,
            resetId,
          },
        },
        { mergeObjects: true },
      );

      // TODO send email with reset

      await this.userRepository.persistAndFlush(userEntity);
    } else if (userEntity && !userEntity.active) {
      // TODO send email telling user acount is inactive
    }
  }

  async resetPassword(resetId: string, password: string): Promise<UserEntity> {
    await resetPasswordSchema.validate({ password });

    const userEntity = await this.userRepository.findOne({
      reset: {
        resetId,
      },
      active: true,
    });

    const resetExpiration = userEntity?.reset.resetExpiration
      ? Number(userEntity?.reset.resetExpiration)
      : 0;

    if (!userEntity || resetExpiration < Date.now()) {
      throw new NotAuthorized();
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    userEntity.assign({ password: hashedPassword });

    await this.userRepository.persistAndFlush(userEntity);

    return userEntity;
  }
}
