import { EntityRepository } from '@mikro-orm/postgresql';
import { LoginRequest } from '@root/__generatedTypes__';
import { UserEntity } from '@users/entities/UserEntity';
import bcrypt from 'bcryptjs';
import { NotAuthorized } from '@error/exceptions/NotAuthorized';

export class AuthService {
  constructor(private userRepository: EntityRepository<UserEntity>) {}

  async login(request: LoginRequest): Promise<UserEntity> {
    const userEntity = await this.userRepository.findOne({
      username: request.username,
      active: true,
    });

    if (!userEntity || !userEntity.password) {
      throw new NotAuthorized();
    }

    const isValid = await bcrypt.compare(request.password, userEntity.password);

    if (!isValid) {
      throw new NotAuthorized();
    }

    return userEntity;
  }
}
