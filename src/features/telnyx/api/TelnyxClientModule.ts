import { Module } from '@nestjs/common';
import { ConfigModule } from '../../config/config.module';
import { TelnyxClient } from './TelnyxClient';
import { TelnyxClientImpl } from './TelnyxClientImpl';

@Module({
  imports: [
    ConfigModule,
  ],
  exports: [
    TelnyxClient,
  ],
  providers: [
    {
      provide: TelnyxClient,
      useClass: TelnyxClientImpl,
    },
  ],
})
export class TelnyxClientModule {
}
