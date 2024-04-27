import { Module, Scope } from '@nestjs/common';
import { LoggerModule } from '../../logs/logger.module';
import { QueueHandlerManager } from './QueueHandlerManager';

@Module({
  imports: [
    LoggerModule,
  ],
  exports: [
    QueueHandlerManager,
  ],
  providers: [
    {
      provide: QueueHandlerManager,
      useClass: QueueHandlerManager,
      scope: Scope.DEFAULT,
    },
  ],
})
export class QueueHandlersModule {
}
