import { Module } from '@nestjs/common';
import { LoggerModule } from '../../logs/logger.module';
import { QueueBullModule } from '../bull/QueueBullModule';
import { QueueFeeder } from './QueueFeeder';
import { QueueFeederImpl } from './QueueFeederImpl';

@Module({
  imports: [
    LoggerModule,
    QueueBullModule,
  ],
  exports: [
    QueueFeeder,
  ],
  providers: [
    {
      provide: QueueFeeder,
      useClass: QueueFeederImpl,
    },
  ],
})
export class QueueFeederModule {
}
