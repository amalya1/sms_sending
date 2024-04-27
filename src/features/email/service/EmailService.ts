import { Inject } from '@nestjs/common';
import { EmailCreateUserHandler } from '../handler/EmailCreateUserHandler';
import { EmailEvent, EmailEventData } from './types';
import { EmailHandler } from '../handler/EmailHandler';
import { EmailInviteUserHandler } from '../handler/EmailInviteUserHandler';
import { EmailForgotPasswordHandler } from '../handler/EmailForgotPasswordHandler';
import { AppContextProvider } from '../../../common/context/AppContextProvider';
import { ContextRepo } from '../../../common/types/repository.types';


export abstract class EmailService {
  abstract send(event: EmailEvent<EmailEventData>): Promise<void>
}


export class EmailServiceImpl implements EmailService {
  private readonly handlers: EmailHandler[];
  private readonly ctx: ContextRepo;

  constructor(
    @Inject(AppContextProvider) private readonly context: AppContextProvider,
    @Inject(EmailCreateUserHandler) private readonly emailCreateUserHandler: EmailCreateUserHandler,
    @Inject(EmailInviteUserHandler) private readonly emailInviteUserHandler: EmailInviteUserHandler,
    @Inject(EmailForgotPasswordHandler) private readonly emailForgotPasswordHandler: EmailForgotPasswordHandler,
  ) {
    this.handlers = [
      emailCreateUserHandler,
      emailInviteUserHandler,
      emailForgotPasswordHandler,
    ];
    this.ctx = context.provide('email-service');
  }


  async send(event: EmailEvent<EmailEventData>): Promise<void> {
    const handler = this.handlers.find(h => h.canHandle(event.type));
    if (handler != null) await handler.handle(event.data as never);
    else this.ctx.logger;
  }

}
