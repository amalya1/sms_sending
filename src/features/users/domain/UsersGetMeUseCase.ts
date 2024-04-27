import { Inject } from '@nestjs/common';
import { ContextRepo } from '../../../common/types/repository.types';
import { ApiAuth } from '../../auth/auth.types';
import { UserEntity } from './types';
import { UsersRepository } from './UsersRepository';


export class UsersGetMeUseCase {
  constructor(
    @Inject(UsersRepository) protected usersRepository: UsersRepository,
  ) {
  }

  async invoke(ctx: ContextRepo, auth: ApiAuth): Promise<UserEntity> {
    return await this.usersRepository.get(ctx, auth.userId);
  }

}
