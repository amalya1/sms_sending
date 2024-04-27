import { Module } from '@nestjs/common';
import { ConfigModule } from '../../config/config.module';
import { AuthDatabaseModule } from '../database/AuthDatabaseModule';
import { AuthDbToEntityMapper } from './mappers';
import { AuthRepositoryImpl } from './AuthRepositoryImpl';
import { AuthRepository } from '../domain/AuthRepository';

@Module({
  imports: [AuthDatabaseModule, ConfigModule],
  exports: [AuthRepository],
  providers: [
    {
      provide: AuthRepository,
      useClass: AuthRepositoryImpl,
    },
    {
      provide: AuthDbToEntityMapper,
      useClass: AuthDbToEntityMapper,
    },
  ],
})
export class AuthRepositoryModule {
}
