import { Module } from '@nestjs/common';
import { ConfigModule } from '../../config/config.module';
import { AuthService, AuthServiceImpl } from './AuthService';
import { CompanyUserRepositoryModule } from '../../companyUser/repository/CompanyUserRepositoryModule';
import { CompaniesRepositoryModule } from '../../companies/repository/CompaniesRepositoryModule';
import { UsersRepositoryModule } from '../../users/repository/UsersRepositoryModule';

@Module({
  imports: [
    ConfigModule,
    UsersRepositoryModule,
    CompanyUserRepositoryModule,
    CompaniesRepositoryModule,
  ],
  exports: [
    AuthService,
  ],
  providers: [
    {
      provide: AuthService,
      useClass: AuthServiceImpl,
    },
  ],
})
export class AuthServiceModule {
}
