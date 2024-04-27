import { Inject } from '@nestjs/common';
import { Optional } from '../../../common/types/entity.types';
import { Logger } from '../../../common/types/logger.types';
import { LoggerToken } from '../../logs/logger.provider';
import { QueueEvent } from '../domain/types';
import { QueueHandler } from './types';

export class QueueHandlerManager {

  private readonly map: Map<string, QueueHandler<QueueEvent<unknown>>> = new Map();
  private readonly logger: Logger;

  constructor(
    @Inject(LoggerToken) logger: Logger,
  ) {
    this.logger = logger.child({ source: 'queue-handler-manager' });
  }

  get(key: string): Optional<QueueHandler<QueueEvent<unknown>>> {
    return this.map.get(key) || null;
  }

  assign(key: string, queueHandler: QueueHandler<QueueEvent<unknown>>) {
    this.map.set(key, queueHandler);
    this.logger.debug(`"${key}" handler assigned`);
  }

}
