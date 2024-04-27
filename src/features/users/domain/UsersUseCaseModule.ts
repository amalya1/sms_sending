import { Module } from '@nestjs/common';
import { UsersRepositoryModule } from '../repository/UsersRepositoryModule';
import { ConfigModule } from '../../config/config.module';
import { UsersGetMeUseCase } from './UsersGetMeUseCase';
import { UsersInviteUseCase } from './UsersInviteUseCase';
import { UsersServiceModule } from '../service/UsersServiceModule';
import { RolesRepositoryModule } from '../../roles/repository/RolesRepositoryModule';
import { CompanyUserRepositoryModule } from '../../companyUser/repository/CompanyUserRepositoryModule';
import { AuthServiceModule } from '../../auth/service/AuthServiceModule';
import { EmailServiceModule } from '../../email/service/EmailServiceModule';
import { UsersChangeRoleUseCase } from './UsersChangeRoleUseCase';
import { UsersCompaniesGetUseCase } from './UsersCompaniesGetUseCase';
import { CompaniesRepositoryModule } from '../../companies/repository/CompaniesRepositoryModule';
import { UsersUpdateUseCase } from './UsersUpdateUseCase';
import { UsersSearchUseCase } from './UsersSearchUseCase';
import { UsersGetUseCase } from './UsersGetUseCase';
import { UsersChangePasswordUseCase } from './UsersChangePasswordUseCase';

@Module({
  imports: [
    UsersRepositoryModule,
    ConfigModule,
    UsersServiceModule,
    CompanyUserRepositoryModule,
    CompaniesRepositoryModule,
    RolesRepositoryModule,
    AuthServiceModule,
    EmailServiceModule,
  ],
  exports: [
    UsersGetMeUseCase,
    UsersInviteUseCase,
    UsersCompaniesGetUseCase,
    UsersChangeRoleUseCase,
    UsersUpdateUseCase,
    UsersSearchUseCase,
    UsersGetUseCase,
    UsersChangePasswordUseCase,
  ],
  providers: [
    {
      provide: UsersInviteUseCase,
      useClass: UsersInviteUseCase,
    },
    {
      provide: UsersCompaniesGetUseCase,
      useClass: UsersCompaniesGetUseCase,
    },
    {
      provide: UsersGetMeUseCase,
      useClass: UsersGetMeUseCase,
    },
    {
      provide: UsersChangeRoleUseCase,
      useClass: UsersChangeRoleUseCase,
    },
    {
      provide: UsersUpdateUseCase,
      useClass: UsersUpdateUseCase,
    },
    {
      provide: UsersSearchUseCase,
      useClass: UsersSearchUseCase,
    },
    {
      provide: UsersGetUseCase,
      useClass: UsersGetUseCase,
    },
    {
      provide: UsersChangePasswordUseCase,
      useClass: UsersChangePasswordUseCase,
    },
  ],
})

export class UsersUseCaseModule {
}
