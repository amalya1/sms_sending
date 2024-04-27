import { Module } from '@nestjs/common';
import { ConfigModule } from '../../config/config.module';
import { AuthLoginPasswordUseCase } from './AuthLoginPasswordUseCase';
import { UsersRepositoryModule } from '../../users/repository/UsersRepositoryModule';
import { AuthServiceModule } from '../service/AuthServiceModule';
import { AuthRefreshTokenUseCase } from './AuthRefreshTokenUseCase';
import { AuthRepositoryModule } from '../repository/AuthRepositoryModule';
import { AuthSetPasswordUseCase } from './AuthSetPasswordUseCase';
import { AuthLogoutUseCase } from './AuthLogoutUseCase';
import { AuthForgotPasswordUseCase } from './AuthForgotPasswordUseCase';
import { EmailServiceModule } from '../../email/service/EmailServiceModule';
import { UsersServiceModule } from '../../users/service/UsersServiceModule';

@Module({
  imports: [
    ConfigModule,
    UsersRepositoryModule,
    AuthServiceModule,
    AuthRepositoryModule,
    EmailServiceModule,
    UsersServiceModule,
  ],
  exports: [
    AuthLoginPasswordUseCase,
    AuthSetPasswordUseCase,
    AuthRefreshTokenUseCase,
    AuthLogoutUseCase,
    AuthForgotPasswordUseCase,
  ],
  providers: [
    {
      provide: AuthLoginPasswordUseCase,
      useClass: AuthLoginPasswordUseCase,
    },
    {
      provide: AuthSetPasswordUseCase,
      useClass: AuthSetPasswordUseCase,
    },
    {
      provide: AuthRefreshTokenUseCase,
      useClass: AuthRefreshTokenUseCase,
    },
    {
      provide: AuthLogoutUseCase,
      useClass: AuthLogoutUseCase,
    },
    {
      provide: AuthForgotPasswordUseCase,
      useClass: AuthForgotPasswordUseCase,
    },
  ],
})
export class AuthUseCaseModule {
}
