import { Module } from '@nestjs/common';
import { LoggerModule } from '../../logs/logger.module';
import { ContactsDatabase, ContactsDatabaseImpl } from './ContactsDatabase';

@Module({
  imports: [LoggerModule],
  exports: [ContactsDatabase],
  providers: [
    {
      provide: ContactsDatabase,
      useClass: ContactsDatabaseImpl,
    },
  ],
})

export class ContactsDatabaseModule {
}
