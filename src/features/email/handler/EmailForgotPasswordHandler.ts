import { EmailHandler } from './EmailHandler';
import { EmailEventType, ForgotPasswordEventData } from '../service/types';
import { ContextRepo } from '../../../common/types/repository.types';
import { Inject } from '@nestjs/common';
import { Config } from '../../../common/config/config';
import { EmailSender } from '../sender/EmailSender';
import { UsersRepository } from '../../users/domain/UsersRepository';
import { UserEntity } from '../../users/domain/types';
import { EmailPayload } from '../sender/types';
import { requireNotNull, requireNotNulls } from '../../../common/utils/utils.base';
import { AppContextProvider } from '../../../common/context/AppContextProvider';
import * as querystring from 'querystring';

type Input = {
  user: UserEntity
  templateId: string
  webUrl: string
}

export class EmailForgotPasswordHandler implements EmailHandler {
  protected readonly ctx: ContextRepo;

  constructor(
    @Inject(AppContextProvider) private readonly context: AppContextProvider,
    @Inject(Config) private readonly config: Config,
    @Inject(EmailSender) private readonly emailSender: EmailSender,
    @Inject(UsersRepository) private readonly usersRepository: UsersRepository,
  ) {
    this.ctx = context.provide('email-forgot-password-handler');

  } 

  canHandle(type: EmailEventType): boolean {
    return type === 'ForgotPasswordEvent';
  }

  async handle(data: ForgotPasswordEventData): Promise<void> {
    const input = await this.prepareInput(data);
    const payload = await EmailForgotPasswordHandler.preparePayload(input);
    await this.emailSender.process({ userId: input.user.id, payload: payload });
  }

  private static preparePayload(input: Input): EmailPayload {
    return {
      templateId: input.templateId,
      dynamicTemplateData: {
        targetUser: {
          firstName: input.user.firstName,
          lastName: input.user.lastName,
        },
        webUrl: input.webUrl,
        subject: 'Password reset request.',
        message: 'You\'ve got.',
      },
    };
  }

  private async prepareInput (data: ForgotPasswordEventData): Promise<Input> {
    const [user] = requireNotNulls(await this.usersRepository.list(this.ctx, [data.userId]));

    return {
      user: user,
      templateId: this.config.sendGrid.templates.forgot_password,
      webUrl: EmailForgotPasswordHandler.createLink(this.config, requireNotNull(user.resetPasswordToken)),
    };
  }

  private static createLink(config: Config, code: string): string {
    return `${config.web.baseUrl}/set-password?${querystring.stringify({ code: code })}`;
  }
}
