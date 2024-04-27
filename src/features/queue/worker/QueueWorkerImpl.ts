import { Inject } from '@nestjs/common';
import { Job, Worker } from 'bullmq';
import IORedis from 'ioredis';
import { Config } from '../../../common/config/config';
import { Logger } from '../../../common/types/logger.types';
import { LoggerToken } from '../../logs/logger.provider';
import { QueueHandlerManager } from '../handler/QueueHandlerManager';
import { QueueWorker } from './QueueWorker';

export class QueueWorkerImpl implements QueueWorker {

  constructor(
    @Inject(Config) private readonly config: Config,
    @Inject(LoggerToken) private logger: Logger,
    @Inject(QueueHandlerManager) private readonly manager: QueueHandlerManager,
  ) {
    this.logger = this.logger.child({ source: 'queue-worker' });
  }

  async process(): Promise<void> {
    const worker = new Worker(
      'queue_events_new',
      async (job: Job) => {
        try {
          const handler = this.manager.get(job.data.key);
          if (handler != null) {
            await handler.process(job.data);
            this.logger.debug(`⚪ Event processed: ${JSON.stringify(job.data)}`);
          } else {
            this.logger.error(`❌ Event failed: ${JSON.stringify(job.data)}`);
            this.logger.error(`Missing handler for: ${JSON.stringify(job.data.key)}`);
          }
        } catch (e) {
          this.logger.error(`❌ Event failed: ${JSON.stringify(job.data)}`);
          if (e instanceof Error) this.logger.error(e);
        }
        return;
      },
      {
        concurrency: 5,
        connection: new IORedis(this.config.redis.url, { maxRetriesPerRequest: null }),
        autorun: false,
      },
    );
    await worker.run();
  }
}
