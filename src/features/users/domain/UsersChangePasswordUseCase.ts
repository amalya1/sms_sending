import { ContextRepo } from '../../../common/types/repository.types';
import { ApiAuth } from '../../auth/auth.types';
import { Inject } from '@nestjs/common';
import { UsersRepository } from './UsersRepository';
import { UserChangePasswordInput } from './types';
import { RolesRepository } from '../../roles/domain/RolesRepository';
import { CompanyUserRepository } from '../../companyUser/domain/CompanyUserRepository';
import { AuthService } from '../../auth/service/AuthService';
import { errorUserNotFound } from './errors';
import { errorValidation } from '../../../common/errors/errors.types';
import { comparePassword, protectPassword } from '../users.utils';


export class UsersChangePasswordUseCase {
  constructor(
    @Inject(UsersRepository) protected usersRepository: UsersRepository,
    @Inject(RolesRepository) protected rolesRepository: RolesRepository,
    @Inject(CompanyUserRepository) protected companyUserRepository: CompanyUserRepository,
    @Inject(AuthService) protected authService: AuthService,
  ) {
  }

  async invoke(ctx: ContextRepo, auth: ApiAuth, input: UserChangePasswordInput): Promise<void> {
    const { userId } = input;
    if (userId != auth.userId) throw errorValidation('Not allowed to update user!')

    const [user] = await this.usersRepository.list(ctx, [userId]);
    if (user == null || user.status != 'active')
      throw errorUserNotFound(userId);
    if (user.password == null || !await comparePassword(input.currentPassword, user.password))
      throw errorValidation('Invalid password');

    const protectedPassword = await protectPassword(input.password);
    await this.usersRepository.update(
      ctx,
      user.setPassword(protectedPassword, user.id),
    );
  }

}
