import { Module } from '@nestjs/common';
import { Queue } from 'bullmq';
import IORedis from 'ioredis';
import { Config } from '../../../common/config/config';
import { Logger } from '../../../common/types/logger.types';
import { ConfigModule } from '../../config/config.module';
import { LoggerModule } from '../../logs/logger.module';
import { LoggerToken } from '../../logs/logger.provider';

export const QueueBullToken = 'queue-bull-token';

@Module({
  imports: [
    ConfigModule,
    LoggerModule,
  ],
  exports: [
    QueueBullToken,
  ],
  providers: [
    {
      provide: QueueBullToken,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      useFactory: (config: Config, logger: Logger) => {
        return new Queue(
          'queue-bull-events',
          {
            defaultJobOptions: {
              removeOnFail: true,
            },
            connection: new IORedis(config.redis.url, { maxRetriesPerRequest: null }),
          },
        );
      },
      inject: [Config, LoggerToken],
    },
  ],
})
export class QueueBullModule {
}
