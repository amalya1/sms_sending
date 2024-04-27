import { Inject } from '@nestjs/common';
import { Config } from '../../../common/config/config';
import { ContextRepo } from '../../../common/types/repository.types';
import { UsersPermissionsView } from './types';
import { ApiAuth } from '../../auth/auth.types';
import { EntityId } from '../../../common/types/entity.types';
import { AuthService } from '../../auth/service/AuthService';
import { CompanyUserRepository } from '../../companyUser/domain/CompanyUserRepository';


export class UsersPermissionsViewer {

  constructor(
    @Inject(Config) private readonly config: Config,
    @Inject(AuthService) protected authService: AuthService,
     @Inject(CompanyUserRepository) protected companyUserRepository: CompanyUserRepository,
  ) {
  }


  async view(ctx: ContextRepo, auth: ApiAuth, companyId: EntityId): Promise<UsersPermissionsView> {
    const companyUser = await this.authService.authFromCompanyUser(ctx, auth, companyId);

    return { permissions: companyUser.permissions as PermissionName[] };
  }
}
