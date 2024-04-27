import { Inject } from '@nestjs/common';
import { Config } from '../../../common/config/config';
import { ContextRepo } from '../../../common/types/repository.types';
import { requireNotNulls } from '../../../common/utils/utils.base';
import { EmailHandler } from './EmailHandler';
import { EmailEventType, InviteUserEventData } from '../service/types';
import { EmailPayload } from '../sender/types';
import { EmailSender } from '../sender/EmailSender';
import { UsersRepository } from '../../users/domain/UsersRepository';
import { UserEntity } from '../../users/domain/types';
import { CompanyEntity } from '../../companies/domain/types';
import { CompaniesRepository } from '../../companies/domain/CompaniesRepository';
import { AppContextProvider } from '../../../common/context/AppContextProvider';

type Input = {
  user: UserEntity
  company: CompanyEntity
  templateId: string
  webUrl: string
}

export class EmailInviteUserHandler implements EmailHandler {
  protected readonly ctx: ContextRepo;

  constructor(
    @Inject(AppContextProvider) private readonly context: AppContextProvider,
    @Inject(Config) private readonly config: Config,
    @Inject(EmailSender) private readonly emailSender: EmailSender,
    @Inject(UsersRepository) private readonly usersRepository: UsersRepository,
    @Inject(CompaniesRepository) private readonly companiesRepository: CompaniesRepository,
  ) {
    this.ctx = context.provide('email-invite-user-handler');
  }

  canHandle(type: EmailEventType): boolean {
    return type == 'InviteUserEvent';
  }

  async handle(data: InviteUserEventData): Promise<void> {
    const input = await this.prepareInput(data);
    const payload = await EmailInviteUserHandler.preparePayload(input);
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
        company: {
          name: input.company.name,
        },
        webUrl: input.webUrl,
        subject: 'You\'ve got invited to BHI platform.',
        message: 'You\'ve got.',
      },
    };

  }

  private async prepareInput (data: InviteUserEventData): Promise<Input> {
    const [user] = requireNotNulls(await this.usersRepository.list(this.ctx, [data.userId]));
    const [company] = requireNotNulls(await this.companiesRepository.list(this.ctx, [data.companyId]));

    return {
      user: user,
      company: company,
      templateId: this.config.sendGrid.templates.invite_user,
      webUrl: this.config.web.baseUrl,
    };
  }


}

