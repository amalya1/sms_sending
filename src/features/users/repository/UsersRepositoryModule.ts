import { Module } from '@nestjs/common';
import { ConfigModule } from '../../config/config.module';
import { UsersRepository } from '../domain/UsersRepository';
import { UsersRepositoryImpl } from './UsersRepositoryImpl';
import { UsersDatabaseModule } from '../database/UsersDatabaseModule';
import { UserDbToEntityMapper, UserEntityToDbMapper } from './mappers';

@Module({
  imports: [UsersDatabaseModule, ConfigModule],
  exports: [UsersRepository],
  providers: [
    {
      provide: UsersRepository,
      useClass: UsersRepositoryImpl,
    },
    {
      provide: UserDbToEntityMapper,
      useClass: UserDbToEntityMapper,
    },
    {
      provide: UserEntityToDbMapper,
      useClass: UserEntityToDbMapper,
    },
  ],
})
export class UsersRepositoryModule {
}
