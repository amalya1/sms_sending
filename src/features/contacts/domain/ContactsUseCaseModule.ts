import { Module } from '@nestjs/common';
import { ContactsRepositoryModule } from '../repository/ContactsRepositoryModule';
import { ContactsSearchUseCase } from './ContactsSearchUseCase';
import { ContactsAddUseCase } from './ContactsAddUseCase';
import { AuthServiceModule } from '../../auth/service/AuthServiceModule';
import { ContactsUpdateUseCase } from './ContactsUpdateUseCase';
import { ContactsGetUseCase } from './ContactsGetUseCase';
import { ContactsDeleteUseCase } from './ContactsDeleteUseCase';
import { GroupsRepositoryModule } from '../../groups/repository/GroupsRepositoryModule';
import { ContactGroupRepositoryModule } from '../../contactGroup/repository/ContactGroupRepositoryModule';
import { ContactsUploadCSVUseCase } from './ContactsUploadCSVUseCase';
import { ContactsUploadCsvServiceModule } from '../service/ContactsUploadCsvServiceModule';
import { MulterModule, MulterModuleOptions } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

@Module({
  imports: [
    AuthServiceModule,
    ContactsRepositoryModule,
    GroupsRepositoryModule,
    ContactGroupRepositoryModule,
    ContactsUploadCsvServiceModule,
    MulterModule.registerAsync({
      useFactory: () => {
        const storageOptions: MulterModuleOptions = {
          storage: memoryStorage(),
        };
        return storageOptions;
      },
    }),
  ],
  exports: [
    ContactsGetUseCase,
    ContactsDeleteUseCase,
    ContactsUpdateUseCase,
    ContactsAddUseCase,
    ContactsSearchUseCase,
    ContactsUploadCSVUseCase,
  ],
  providers: [
    {
      provide: ContactsGetUseCase,
      useClass: ContactsGetUseCase,
    },
    {
      provide: ContactsDeleteUseCase,
      useClass: ContactsDeleteUseCase,
    },
    {
      provide: ContactsUpdateUseCase,
      useClass: ContactsUpdateUseCase,
    },
    {
      provide: ContactsAddUseCase,
      useClass: ContactsAddUseCase,
    },
    {
      provide: ContactsSearchUseCase,
      useClass: ContactsSearchUseCase,
    },
    {
      provide: ContactsUploadCSVUseCase,
      useClass: ContactsUploadCSVUseCase,
    },
  ],
})
export class ContactsUseCaseModule {
}
