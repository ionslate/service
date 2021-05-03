import { EntityRepository } from '@mikro-orm/postgresql';
import { LoginRequest } from '@root/__generatedTypes__';
import { UserEntity } from '@users/entities/UserEntity';
import bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';

const ONE_HOUR = 3600000;

export class AuthService {
  constructor(private userRepository: EntityRepository<UserEntity>) {}

  async login(request: LoginRequest): Promise<UserEntity> {
    const userEntity = await this.userRepository.findOne({
      username: request.username,
      active: true,
    });

    if (!userEntity || !userEntity.password) {
      throw new Error('NOT AUTHORIZED');
    }

    const isValid = await bcrypt.compare(request.password, userEntity.password);

    if (!isValid) {
      throw new Error('NOT AUTHORIZED');
    }

    return userEntity;
  }

  async resetPasswordRequest(email: string): Promise<void> {
    const userEntity = await this.userRepository.findOne({
      email,
      active: true,
    });

    if (userEntity) {
      const resetId = uuid();

      userEntity.assign(
        {
          reset: {
            resetExipration: Date.now() + ONE_HOUR,
            resetId,
          },
        },
        { mergeObjects: true },
      );

      // TODO send email with reset

      await this.userRepository.persistAndFlush(userEntity);
    }
  }

  async resetPassword(resetId: string, password: string): Promise<void> {
    const userEntity = await this.userRepository.findOne({
      reset: {
        resetId,
      },
      active: true,
    });

    if (!userEntity) {
      throw new Error('NOT AUTHORIZED');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    userEntity.assign({ password: hashedPassword });

    await this.userRepository.persistAndFlush(userEntity);
  }
}
