import { Module } from '@nestjs/common';
import { ContactsRepositoryModule } from '../repository/ContactsRepositoryModule';
import { ContactsSimpleViewer } from './ContactsSimpleViewer';
import { ContactsUploadCSVViewer } from './ContactsUploadCSVViewer';

@Module({
  imports: [
    ContactsRepositoryModule,
  ],
  exports: [
    ContactsSimpleViewer,
    ContactsUploadCSVViewer,
  ],
  providers: [
    {
      provide: ContactsSimpleViewer,
      useClass: ContactsSimpleViewer,
    },
    {
      provide: ContactsUploadCSVViewer,
      useClass: ContactsUploadCSVViewer,
    },
  ],
})
export class ContactsViewModule {
}
