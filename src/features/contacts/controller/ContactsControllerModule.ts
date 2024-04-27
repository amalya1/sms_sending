import { Module } from '@nestjs/common';
import { ContactsUseCaseModule } from '../domain/ContactsUseCaseModule';
import { ContactsViewModule } from '../viewer/ContactsViewModule';
import { ContactsController } from './ContactsController';
import { ContextModule } from '../../../common/context/ContextModule';

@Module({
  imports: [
    ContactsUseCaseModule,
    ContactsViewModule,
    ContextModule,
  ],
  controllers: [
    ContactsController,
  ],
})
export class ContactsControllerModule {
}
