import { ContextRepo } from '../../../common/types/repository.types';
import { ApiAuth } from '../../auth/auth.types';
import { Inject } from '@nestjs/common';
import { UsersRepository } from './UsersRepository';
import { AuthService } from '../../auth/service/AuthService';
import { errorUserNotFound } from './errors';
import { UserUpdateInput } from './types';
import { errorValidation } from '../../../common/errors/errors.types';


export class UsersUpdateUseCase {
  constructor(
    @Inject(UsersRepository) protected usersRepository: UsersRepository,
    @Inject(AuthService) protected authService: AuthService,
  ) {
  }


  async invoke(ctx: ContextRepo, auth: ApiAuth, input: UserUpdateInput): Promise<void> {
    const { userId } = input;
    if (auth.type != 'admin' && userId != auth.userId) throw errorValidation('Not allowed to update user!');

    const [user] = await this.usersRepository.list(ctx, [userId]);
    if (user == null || user.status != 'active') throw errorUserNotFound(userId);

    await this.usersRepository.update(
      ctx,
      user.setNames(input.firstName, input.lastName, auth.userId).setPhoneNumber(input.phoneNumber, auth.userId),
    );
  }

}
