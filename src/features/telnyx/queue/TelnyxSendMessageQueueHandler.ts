import { Inject } from '@nestjs/common';
import { AppContextProvider } from '../../../common/context/AppContextProvider';
import { ContextRepo } from '../../../common/types/repository.types';
import { filterNotNull } from '../../../common/utils/utils.base';
import { CompaniesPhoneRepository } from '../../companiesPhone/domain/CompaniesPhoneRepository';
import { ContactsRepository } from '../../contacts/domain/ContactsRepository';
import { QueueHandlerManager } from '../../queue/handler/QueueHandlerManager';
import { QueueHandler } from '../../queue/handler/types';
import { TelnyxRepository } from '../domain/TelnyxRepository';
import { TelnyxCreateMessagesArgs } from '../domain/types';
import { TelnyxService } from '../service/TelnyxService';
import { TelnyxSendMessageQueueEvent, telnyxSendMessageQueueKey } from './types';

export class TelnyxSendMessageQueueHandler extends QueueHandler<TelnyxSendMessageQueueEvent> {

  private readonly ctx: ContextRepo;

  constructor(
    @Inject(AppContextProvider) contextProvider: AppContextProvider,
    @Inject(TelnyxRepository) private readonly telnyxRepo: TelnyxRepository,
    @Inject(ContactsRepository) private readonly contactsRepo: ContactsRepository,
    @Inject(CompaniesPhoneRepository) private readonly phoneRepository: CompaniesPhoneRepository,
    @Inject(TelnyxService) private readonly telnyxService: TelnyxService,
    @Inject(QueueHandlerManager) manager: QueueHandlerManager,
  ) {
    super(manager);
    this.ctx = contextProvider.provide('telnyx-send-message-handler');
  }

  key(): string {
    return telnyxSendMessageQueueKey;
  }

  async process(event: TelnyxSendMessageQueueEvent): Promise<void> {
    const receivers = filterNotNull(
      await this.contactsRepo.list(this.ctx, event.data.contacts),
    );
    const [phone] = await this.phoneRepository.search(
      this.ctx,
      {
        companies: [event.data.company],
      },
    );
    const messages = await this.telnyxService.sendSms({
      receiversPhones: receivers.map(r => r.phoneNumber),
      text: event.data.text,
      senderPhone: phone.number,
    });
    const params: TelnyxCreateMessagesArgs = messages.map(m => {
      return {
        senderPhone: phone.number,
        receiverPhone: m.receiverPhone,
        externalId: m.externalId,
      };
    });
    await this.telnyxRepo.createMessages(this.ctx, params);
  }

}
