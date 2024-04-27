import { Module } from '@nestjs/common';
import { ContactsUploadCSVService, ContactsUploadCSVServiceImpl } from './ContactsUploadCSVService';

@Module({
  imports: [],
  exports: [
    ContactsUploadCSVService,
  ],
  providers: [
    {
      provide: ContactsUploadCSVService,
      useClass: ContactsUploadCSVServiceImpl,
    },
  ],
})
export class ContactsUploadCsvServiceModule {
}
