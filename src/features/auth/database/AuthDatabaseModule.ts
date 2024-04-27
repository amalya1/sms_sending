import { Module } from '@nestjs/common';
import { ConfigModule } from '../../config/config.module';
import { LoggerModule } from '../../logs/logger.module';
import { AuthDatabase, AuthDatabaseImpl } from './AuthDatabase';

@Module({
  imports: [ConfigModule, LoggerModule],
  exports: [AuthDatabase],
  providers: [
    {
      provide: AuthDatabase,
      useClass: AuthDatabaseImpl,
    },
  ],
})

export class AuthDatabaseModule {
}
