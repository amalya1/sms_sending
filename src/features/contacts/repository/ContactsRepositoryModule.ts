import { Module } from '@nestjs/common';
import { ContactsDatabaseModule } from '../database/ContactsDatabaseModule';
import { ContactsRepository } from '../domain/ContactsRepository';
import { ContactDbToEntityMapper, ContactEntityToDbMapper } from './mappers';
import { ContactsRepositoryImpl } from './ContactsRepositoryImpl';

@Module({
  imports: [ContactsDatabaseModule],
  exports: [ContactsRepository],
  providers: [
    {
      provide: ContactsRepository,
      useClass: ContactsRepositoryImpl,
    },
    {
      provide: ContactDbToEntityMapper,
      useClass: ContactDbToEntityMapper,
    },
    {
      provide: ContactEntityToDbMapper,
      useClass: ContactEntityToDbMapper,
    },
  ],
})
export class ContactsRepositoryModule {
}
