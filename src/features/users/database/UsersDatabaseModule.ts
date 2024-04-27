import { Module } from '@nestjs/common';
import { LoggerModule } from '../../logs/logger.module';
import { UsersDatabase, UsersDatabaseImpl } from './UsersDatabase';

@Module({
  imports: [LoggerModule],
  exports: [UsersDatabase],
  providers: [
    {
      provide: UsersDatabase,
      useClass: UsersDatabaseImpl,
    },
  ],
})
export class UsersDatabaseModule {
}
