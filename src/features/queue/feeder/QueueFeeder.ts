import { QueueEvent } from '../domain/types';

export abstract class QueueFeeder {
  abstract feed(event: QueueEvent<unknown>): Promise<void>
}
