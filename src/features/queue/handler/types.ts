import { Inject } from '@nestjs/common';
import { QueueEvent } from '../domain/types';
import { QueueHandlerManager } from './QueueHandlerManager';

export abstract class QueueHandler<Event extends QueueEvent<unknown>> {

  constructor(
    @Inject(QueueHandlerManager) private readonly manager: QueueHandlerManager,
  ) {
    this.manager.assign(this.key(), this);
  }

  abstract process(event: Event): Promise<void>;

  abstract key(): string;
}
