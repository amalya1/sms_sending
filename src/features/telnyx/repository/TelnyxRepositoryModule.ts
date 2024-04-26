import { Module } from '@nestjs/common';
import { TelnyxDatabaseModule } from '../database/TelnyxDatabaseModule';
import { TelnyxRepository } from '../domain/TelnyxRepository';
import { TelnyxRepositoryImpl } from './TelnyxRepositoryImpl';

@Module({
  imports: [
    TelnyxDatabaseModule,
  ],
  exports: [
    TelnyxRepository,
  ],
  providers: [
    {
      provide: TelnyxRepository,
      useClass: TelnyxRepositoryImpl,
    },
  ],
})
export class TelnyxRepositoryModule {
}
