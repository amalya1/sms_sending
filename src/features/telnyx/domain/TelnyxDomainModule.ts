import { Module } from '@nestjs/common';
import { CompaniesPhoneRepositoryModule } from '../../companiesPhone/repository/CompaniesPhoneRepositoryModule';
import { ConfigModule } from '../../config/config.module';
import { ContactsRepositoryModule } from '../../contacts/repository/ContactsRepositoryModule';
import { TelnyxRepositoryModule } from '../repository/TelnyxRepositoryModule';
import { TelnyxServiceModule } from '../service/TelnyxServiceModule';
import { TelnyxWebhookUseCase } from './TelnyxWebhookUseCase';

@Module({
  imports: [
    TelnyxRepositoryModule,
    TelnyxServiceModule,
    ContactsRepositoryModule,
    CompaniesPhoneRepositoryModule,
    ConfigModule,
  ],
  exports: [
    TelnyxWebhookUseCase,
  ],
  providers: [
    {
      provide: TelnyxWebhookUseCase,
      useClass: TelnyxWebhookUseCase,
    },
  ],
})
export class TelnyxDomainModule {
}
