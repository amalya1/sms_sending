import { Module } from '@nestjs/common';
import { ConfigModule } from '../../config/config.module';
import { TelnyxClientModule } from '../api/TelnyxClientModule';
import { TelnyxService } from './TelnyxService';
import { TelnyxServiceImpl } from './TelnyxServiceImpl';

@Module({
  imports: [
    ConfigModule,
    TelnyxClientModule,
  ],
  exports: [
    TelnyxService,
  ],
  providers: [
    {
      provide: TelnyxService,
      useClass: TelnyxServiceImpl,
    },
  ],
})
export class TelnyxServiceModule {
}
