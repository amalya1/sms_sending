import { Module } from '@nestjs/common';
import { ConfigModule } from '../../config/config.module';
import { UsersSimpleViewer } from './UsersSimpleViewer';
import { AuthServiceModule } from '../../auth/service/AuthServiceModule';
import { CompanyUserRepositoryModule } from '../../companyUser/repository/CompanyUserRepositoryModule';
import { UsersPermissionsViewer } from './UsersPermissionsViewer';

@Module({
  imports: [
    ConfigModule,
    AuthServiceModule,
    CompanyUserRepositoryModule,
  ],
  exports: [
    UsersSimpleViewer,
    UsersPermissionsViewer,
  ],
  providers: [
    {
      provide: UsersSimpleViewer,
      useClass: UsersSimpleViewer,
    },
    {
      provide: UsersPermissionsViewer,
      useClass: UsersPermissionsViewer,
    },
  ],
})
export class UsersViewerModule {
}
