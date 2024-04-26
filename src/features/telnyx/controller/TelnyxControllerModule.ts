import { Module } from '@nestjs/common';
import { ContextModule } from '../../../common/context/ContextModule';
import { TelnyxDomainModule } from '../domain/TelnyxDomainModule';
import { TelnyxController } from './TelnyxController';

@Module({
  controllers: [
    TelnyxController,
  ],
  imports: [
    TelnyxDomainModule,
    ContextModule,
  ],
})
export class TelnyxControllerModule {
}
