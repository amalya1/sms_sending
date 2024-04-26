import { Module } from '@nestjs/common';
import { ContextModule } from '../../../common/context/ContextModule';
import { CompaniesPhoneRepositoryModule } from '../../companiesPhone/repository/CompaniesPhoneRepositoryModule';
import { ContactsRepositoryModule } from '../../contacts/repository/ContactsRepositoryModule';
import { QueueHandlersModule } from '../../queue/handler/QueueHandlersModule';
import { TelnyxRepositoryModule } from '../repository/TelnyxRepositoryModule';
import { TelnyxServiceModule } from '../service/TelnyxServiceModule';
import { TelnyxSendMessageQueueHandler } from './TelnyxSendMessageQueueHandler';

@Module({
  imports: [
    QueueHandlersModule,
    ContextModule,
    TelnyxRepositoryModule,
    ContactsRepositoryModule,
    CompaniesPhoneRepositoryModule,
    TelnyxServiceModule,
  ],
  exports: [
    TelnyxSendMessageQueueHandler,
  ],
  providers: [
    {
      provide: TelnyxSendMessageQueueHandler,
      useClass: TelnyxSendMessageQueueHandler,
    },
  ],
})
export class TelnyxQueueModule {
}
