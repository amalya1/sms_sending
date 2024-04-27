import { Module } from '@nestjs/common';
import { EmailHandlerModule } from '../handler/EmailHandlerModule';
import { EmailService, EmailServiceImpl } from './EmailService';
import { ContextModule } from '../../../common/context/ContextModule';

@Module({
  imports: [EmailHandlerModule, ContextModule],
  exports: [EmailService],
  providers: [
    {
      provide: EmailService,
      useClass: EmailServiceImpl,
    },
  ],
})

export class EmailServiceModule {
}
