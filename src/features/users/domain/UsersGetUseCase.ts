import { Inject } from '@nestjs/common';
import { EntityId } from '../../../common/types/entity.types';
import { ContextRepo } from '../../../common/types/repository.types';
import { ApiAuth } from '../../auth/auth.types';
import { authCheckPermissions } from '../../auth/auth.utils';
import { AuthService } from '../../auth/service/AuthService';
import { UserEntity } from './types';
import { UsersRepository } from './UsersRepository';


export class UsersGetUseCase {
  constructor(
    @Inject(UsersRepository) protected usersRepository: UsersRepository,
    @Inject(AuthService) protected authService: AuthService,
  ) {
  }


  async invoke(ctx: ContextRepo, auth: ApiAuth, userId: EntityId, companyId: EntityId): Promise<UserEntity> {
    await this.accessCheck(ctx, auth, companyId, userId);
    return await this.usersRepository.getForCompany(ctx, { userId: userId, companyId: companyId });
  }

  private async accessCheck(ctx: ContextRepo, auth: ApiAuth, companyId: EntityId, userId: EntityId): Promise<void> {
    const companyUserAuth = await this.authService.authFromCompanyUser(ctx, auth, companyId);
    if (companyUserAuth.type != 'admin' && userId != companyUserAuth.userId) {
      authCheckPermissions(companyUserAuth, ['company_admin_access']);
    }
  }
}
