import { Inject } from '@nestjs/common';
import { EntityId } from '../../../common/types/entity.types';
import { ContextRepo } from '../../../common/types/repository.types';
import { ApiAuth } from '../../auth/auth.types';
import { authCheckPermissions } from '../../auth/auth.utils';
import { AuthService } from '../../auth/service/AuthService';
import { UserEntity, UserSearchInput } from './types';
import { UsersRepository } from './UsersRepository';


export class UsersSearchUseCase {
  constructor(
    @Inject(UsersRepository) protected usersRepository: UsersRepository,
    @Inject(AuthService) protected authService: AuthService,
  ) {
  }

  async invoke(ctx: ContextRepo, auth: ApiAuth, input: UserSearchInput): Promise<[UserEntity[], number]> {
    const { companyId } = input;
    await this.accessCheck(ctx, auth, companyId);
    const roles = input.roleId == null ? [] : [input.roleId];

    return await this.usersRepository.search(ctx, {
      type: ['user'],
      companies: [companyId],
      users: [],
      roles: roles,
      limit: input.limit,
      offset: input.offset,
      query: null,
    });
  }

  private async accessCheck(ctx: ContextRepo, auth: ApiAuth, companyId: EntityId): Promise<void> {
    const companyUserAuth = await this.authService.authFromCompanyUser(ctx, auth, companyId);
    if (companyUserAuth.type != 'admin') authCheckPermissions(companyUserAuth, ['company_admin_access']);
  }
}
