import { Inject } from '@nestjs/common';
import { Config } from '../../../common/config/config';
import { ContextRepo } from '../../../common/types/repository.types';
import { requireNotNull, requireNotNulls } from '../../../common/utils/utils.base';
import { EmailHandler } from './EmailHandler';
import { CreateUserEventData, EmailEventType } from '../service/types';
import { EmailPayload } from '../sender/types';
import { EmailSender } from '../sender/EmailSender';
import { UsersRepository } from '../../users/domain/UsersRepository';
import { UserEntity } from '../../users/domain/types';
import { CompaniesRepository } from '../../companies/domain/CompaniesRepository';
import { AppContextProvider } from '../../../common/context/AppContextProvider';
import querystring from 'querystring';

type Input = {
  user: UserEntity
  templateId: string
  webUrl: string
}

export class EmailCreateUserHandler implements EmailHandler {
  protected readonly ctx: ContextRepo;

  constructor(
    @Inject(AppContextProvider) private readonly context: AppContextProvider,
    @Inject(Config) private readonly config: Config,
    @Inject(EmailSender) private readonly emailSender: EmailSender,
    @Inject(UsersRepository) private readonly usersRepository: UsersRepository,
    @Inject(CompaniesRepository) private readonly companiesRepository: CompaniesRepository,
  ) {
    this.ctx = context.provide('email-create-user-handler');
  }

  canHandle(type: EmailEventType): boolean {
    return type == 'CreateUserEvent';
  }

  async handle(data: CreateUserEventData): Promise<void> {
    const input = await this.prepareInput(data);
    const payload = await EmailCreateUserHandler.preparePayload(input);
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
        subject: 'You\'ve got invited to BHI platform.',
        message: 'You\'ve got.',
      },
    };

  }

  private async prepareInput (data: CreateUserEventData): Promise<Input> {
    const [user] = requireNotNulls(await this.usersRepository.list(this.ctx, [data.userId]));

    return {
      user: user,
      templateId: this.config.sendGrid.templates.create_user,
      webUrl: EmailCreateUserHandler.createLink(this.config, requireNotNull(user.resetPasswordToken)),
    };
  }

  private static createLink(config: Config, code: string): string {
    return `${config.web.baseUrl}/set-password?${querystring.stringify({ code: code })}`;
  }

}

