import { Module } from '@nestjs/common';
import { ConfigModule } from '../../config/config.module';
import { EmailCreateUserHandler } from './EmailCreateUserHandler';
import { EmailSenderModule } from '../sender/EmailSenderModule';
import { UsersRepositoryModule } from '../../users/repository/UsersRepositoryModule';
import { CompaniesRepositoryModule } from '../../companies/repository/CompaniesRepositoryModule';
import { EmailInviteUserHandler } from './EmailInviteUserHandler';
import { EmailForgotPasswordHandler } from './EmailForgotPasswordHandler';
import { ContextModule } from '../../../common/context/ContextModule';


@Module({
  imports: [
    ContextModule,
    ConfigModule,
    EmailSenderModule,
    CompaniesRepositoryModule,
    UsersRepositoryModule,
  ],
  exports: [
    EmailCreateUserHandler,
    EmailInviteUserHandler,
    EmailForgotPasswordHandler,
  ],
  providers: [
    {
      provide: EmailCreateUserHandler,
      useClass: EmailCreateUserHandler,
    },
    {
      provide: EmailInviteUserHandler,
      useClass: EmailInviteUserHandler,
    },
    {
      provide: EmailForgotPasswordHandler,
      useClass: EmailForgotPasswordHandler,
    },
  ],
})
export class EmailHandlerModule {
}
