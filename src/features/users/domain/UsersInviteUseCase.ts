import { ContextRepo } from '../../../common/types/repository.types';
import { ApiAuth } from '../../auth/auth.types';
import { Inject } from '@nestjs/common';
import { UsersRepository } from './UsersRepository';
import { UserEntity, UserInviteInput } from './types';
import { EntityId } from '../../../common/types/entity.types';
import { RolesRepository } from '../../roles/domain/RolesRepository';
import { CompanyUserRepository } from '../../companyUser/domain/CompanyUserRepository';
import { errorRoleNotFound } from '../../roles/domain/errors';
import { authCheckPermissions, getPermissionsByRole } from '../../auth/auth.utils';
import { AuthService } from '../../auth/service/AuthService';
import { UsersService } from '../service/UsersService';
import { Config } from '../../../common/config/config';
import { errorUserConflict } from './errors';
import { EmailService } from '../../email/service/EmailService';
import { CreateUserEvent, InviteUserEvent } from '../../email/service/types';

export class UsersInviteUseCase {
  constructor(
    @Inject(UsersRepository) protected usersRepository: UsersRepository,
    @Inject(UsersService) protected usersService: UsersService,
    @Inject(RolesRepository) protected rolesRepository: RolesRepository,
    @Inject(CompanyUserRepository) protected companyUserRepository: CompanyUserRepository,
    @Inject(AuthService) protected authService: AuthService,
    @Inject(Config) private readonly config: Config,
    @Inject(EmailService) private readonly emailService: EmailService,
  ) {
  }

  async invoke(ctx: ContextRepo, auth: ApiAuth, input: UserInviteInput, companyId: EntityId): Promise<UserEntity> {
    await this.accessCheck(ctx, auth, companyId);

    const [role] = await this.rolesRepository.list(ctx, [input.roleId]);
    if (role == null ) throw errorRoleNotFound(input.roleId);
    const permissions = getPermissionsByRole(role.id, role.name);
    const [existedUser] = await this.usersRepository.listByEmail(ctx, [input.email]);
    
    if (existedUser != null) {
      const [existedCompanyUser] = await this.companyUserRepository.getByCompanyAndUser(ctx, companyId, [existedUser.id]);
      if(existedCompanyUser != null) throw errorUserConflict(input.email);
      
      await this.companyUserRepository.add(ctx, {
        userId: existedUser.id,
        roleId: input.roleId,
        companyId: companyId,
        permissions: permissions,
        createdBy: auth.userId,
      });

      await this.emailService.send(new InviteUserEvent({
        userId: existedUser.id,
        companyId: companyId
      }));

      return existedUser;
    }

    const resetPasswordToken = await this.usersService.generateUniqueInvitationCode(ctx);
    const resetPasswordTokenExpire = new Date(new Date().getTime() + this.config.security.resetPasswordTokenExpireHours * 3600000);

    const createdUser = await ctx.sql.begin(async (txSql) => {
      const txCtx = { ...ctx, sql: txSql };
      const createdUser = await this.usersRepository.add(txCtx, {
        email: input.email,
        phoneNumber: input.phoneNumber,
        status: 'active',
        type: 'user',
        password: null,
        firstName: input.firstName,
        lastName: input.lastName,
        createdBy: auth.userId,
        resetPasswordToken: resetPasswordToken,
        resetPasswordTokenExpire: resetPasswordTokenExpire,
      });

      await this.companyUserRepository.add(txCtx, {
        userId: createdUser.id,
        roleId: input.roleId,
        companyId: companyId,
        permissions: permissions,
        createdBy: auth.userId,
      });
      return createdUser;
    });


    await this.emailService.send(new CreateUserEvent({ userId: createdUser.id }));

    return createdUser;
  }


  private async accessCheck(ctx: ContextRepo, auth: ApiAuth, companyId: EntityId): Promise<void> {
    const companyUserAuth = await this.authService.authFromCompanyUser(ctx, auth, companyId);
    if (companyUserAuth.type != 'admin') authCheckPermissions(companyUserAuth, ['company_admin_access']);
  }
}
