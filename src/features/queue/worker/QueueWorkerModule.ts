import { Module } from '@nestjs/common';
import { ConfigModule } from '../../config/config.module';
import { LoggerModule } from '../../logs/logger.module';
import { QueueHandlersModule } from '../handler/QueueHandlersModule';
import { QueueWorker } from './QueueWorker';
import { QueueWorkerImpl } from './QueueWorkerImpl';

@Module({
  imports: [
    ConfigModule,
    LoggerModule,
    QueueHandlersModule,
  ],
  exports: [
    QueueWorker,
  ],
  providers: [
    {
      provide: QueueWorker,
      useClass: QueueWorkerImpl,
    },
  ],
})
export class QueueWorkerModule {
}
