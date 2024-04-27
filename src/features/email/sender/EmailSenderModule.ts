import { Module } from '@nestjs/common';
import { ConfigModule } from '../../config/config.module';
import { EmailSender } from './EmailSender';
import { UsersRepositoryModule } from '../../users/repository/UsersRepositoryModule';
import { ContextModule } from '../../../common/context/ContextModule';


@Module({
  imports: [
    ContextModule,
    ConfigModule,
    UsersRepositoryModule,
  ],
  exports: [
    EmailSender
  ],
  providers: [
    {
      provide: EmailSender,
      useClass: EmailSender,
    },
  ],
})
export class EmailSenderModule {
}
