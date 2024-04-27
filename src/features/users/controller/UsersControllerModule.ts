import { Module } from '@nestjs/common';
import { ContextModule } from '../../../common/context/ContextModule';
import { CompaniesViewModule } from '../../companies/viewer/CompaniesViewModule';
import { UsersUseCaseModule } from '../domain/UsersUseCaseModule';
import { UsersViewerModule } from '../viewer/UsersViewerModule';
import { UsersController } from './UsersController';

@Module({
  imports: [
    UsersUseCaseModule,
    UsersViewerModule,
    CompaniesViewModule,
    ContextModule,
  ],
  controllers: [
    UsersController,
  ],
})
export class UsersControllerModule {
}
