import { Module } from '@nestjs/common';
import { ConfigModule } from '../../config/config.module';
import { AuthTokenViewer } from './AuthTokenViewer';
import { UsersViewerModule } from '../../users/viewer/UsersViewerModule';
import { AuthRepositoryModule } from '../repository/AuthRepositoryModule';

@Module({
  imports: [
    ConfigModule,
    UsersViewerModule,
    AuthRepositoryModule,
  ],
  exports: [
    AuthTokenViewer,
  ],
  providers: [
    {
      provide: AuthTokenViewer,
      useClass: AuthTokenViewer,
    },
  ],
})
export class AuthViewerModule {
}
