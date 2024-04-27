import { Inject } from '@nestjs/common';
import { Config } from '../../../common/config/config';
import { requireNotNull, requireNotNulls } from '../../../common/utils/utils.base';
import SendGrid, { MailDataRequired } from '@sendgrid/mail';
import { EmailDynamicTemplatePayload, EmailSendData } from './types';
import { ContextRepo } from '../../../common/types/repository.types';
import { UsersRepository } from '../../users/domain/UsersRepository';
import { AppContextProvider } from '../../../common/context/AppContextProvider';


export class EmailSender {
  protected readonly ctx: ContextRepo;

  constructor(
    @Inject(Config) private readonly config: Config,
    @Inject(AppContextProvider) private readonly context: AppContextProvider,
    @Inject(UsersRepository) private readonly usersRepository: UsersRepository,
  ) {
    this.ctx = context.provide('email-sender');
    SendGrid.setApiKey(config.sendGrid.apiKey);
  }


  async process(data: EmailSendData): Promise<void> {
    try {
      const [user] = requireNotNulls(await this.usersRepository.list(this.ctx, [data.userId]));
      const payload = data.payload;
      const from = {
        name: this.config.sendGrid.fromName,
        email: this.config.sendGrid.fromEmail,
      };

      const mailData: MailDataRequired = {
        from: from,
        to: requireNotNull(user.email),
        templateId: (payload as EmailDynamicTemplatePayload).templateId,
        dynamicTemplateData: (payload as EmailDynamicTemplatePayload).dynamicTemplateData,
      };
      await SendGrid.send(mailData);
    } catch (e) {
      if (e instanceof Error) this.ctx.logger.error(`Sendgrid email error ${e.name}: ${e.stack}`);
      else this.ctx.logger.error(`Sendgrid email error: ${JSON.stringify(e)}`);
    }
  }

}
