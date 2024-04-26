import { Module } from '@nestjs/common';
import { TelnyxDatabase } from './TelnyxDatabase';
import { TelnyxDatabaseImpl } from './TelnyxDatabaseImpl';

@Module({
  exports: [
    TelnyxDatabase,
  ],
  providers: [
    {
      provide: TelnyxDatabase,
      useClass: TelnyxDatabaseImpl,
    },
  ],
})
export class TelnyxDatabaseModule {
}
