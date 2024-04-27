import { ContextRepo } from '../../../common/types/repository.types';
import { ApiAuth } from '../../auth/auth.types';
import { Inject } from '@nestjs/common';
import { UsersRepository } from './UsersRepository';
import { UserChangeRoleInput } from './types';
import { EntityId } from '../../../common/types/entity.types';
import { RolesRepository } from '../../roles/domain/RolesRepository';
import { CompanyUserRepository } from '../../companyUser/domain/CompanyUserRepository';
import { errorCompanyNotFound } from '../../companies/domain/errors';
import { errorRoleNotFound } from '../../roles/domain/errors';
import { authCheckPermissions, getPermissionsByRole } from '../../auth/auth.utils';
import { AuthService } from '../../auth/service/AuthService';
import { errorUserNotFound } from './errors';

export class UsersChangeRoleUseCase {
  constructor(
    @Inject(UsersRepository) protected usersRepository: UsersRepository,
    @Inject(RolesRepository) protected rolesRepository: RolesRepository,
    @Inject(CompanyUserRepository) protected companyUserRepository: CompanyUserRepository,
    @Inject(AuthService) protected authService: AuthService,
  ) {
  }

  async invoke(ctx: ContextRepo, auth: ApiAuth, input: UserChangeRoleInput, companyId: EntityId): Promise<void> {
    await this.accessCheck(ctx, auth, companyId);

    const { userId } = input;
    const [user] = await this.usersRepository.list(ctx, [userId]);
    if (user == null || user.status != 'active') throw errorUserNotFound(userId);

    const [companyUser] = await this.companyUserRepository.getByCompanyAndUser(ctx, companyId, [userId]);
    if (companyUser == null) throw errorCompanyNotFound(companyId);

    const [role] = await this.rolesRepository.list(ctx, [input.roleId]);
    if (role == null ) throw errorRoleNotFound(input.roleId);
    const permissions = getPermissionsByRole(role.id, role.name);

    await this.companyUserRepository.update(ctx, companyUser.setRolePermissions(role.id, permissions, auth.userId));
  }


  private async accessCheck(ctx: ContextRepo, auth: ApiAuth, companyId: EntityId): Promise<void> {
    const companyUserAuth = await this.authService.authFromCompanyUser(ctx, auth, companyId);
    if (companyUserAuth.type != 'admin') authCheckPermissions(companyUserAuth, ['company_admin_access'])
  }
}
