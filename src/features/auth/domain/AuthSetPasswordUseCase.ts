import { Inject } from '@nestjs/common';
import { ContextRepo } from '../../../common/types/repository.types';
import { errorValidation } from '../../../common/errors/errors.types';
import { UsersRepository } from '../../users/domain/UsersRepository';
import { AuthSetPasswordInput } from './types';
import { protectPassword } from '../../users/users.utils';


export class AuthSetPasswordUseCase {
  constructor(
    @Inject(UsersRepository) protected usersRepository: UsersRepository,
  ) {
  }


  async invoke(ctx: ContextRepo, input: AuthSetPasswordInput): Promise<void> {
    const [user] = await this.usersRepository.listByCode(ctx, [input.token]);
    const currentDateTime = new Date();

    if (user == null
      || user.status != 'active'
      || user.resetPasswordTokenExpire == null
      || user.resetPasswordTokenExpire < currentDateTime) {
      throw errorValidation('Invalid token');
    }

    const protectedPassword = await protectPassword(input.password);
    await this.usersRepository.update(
      ctx,
      user.setPassword(protectedPassword, user.id).setResetToken(null, null, user.id),
    );
  }
}
