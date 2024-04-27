import { Inject } from '@nestjs/common';
import { Queue } from 'bullmq';
import { Logger } from '../../../common/types/logger.types';
import { LoggerToken } from '../../logs/logger.provider';
import { QueueBullToken } from '../bull/QueueBullModule';
import { QueueEvent } from '../domain/types';
import { QueueFeeder } from './QueueFeeder';

export class QueueFeederImpl implements QueueFeeder {

  private readonly logger: Logger;

  constructor(
    @Inject(QueueBullToken) private readonly bull: Queue<QueueEvent<unknown>>,
    @Inject(LoggerToken) logger: Logger,
  ) {
    this.logger = logger.child({ source: 'QueueFeeder' });
  }

  async feed(event: QueueEvent<unknown>): Promise<void> {
    await this.bull.add(event.key, event);
    this.logger.debug(`Event ${event.key} added to queue`);
  }
}
