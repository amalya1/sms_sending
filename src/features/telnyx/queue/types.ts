import { EntityId } from '../../../common/types/entity.types';
import { QueueEvent } from '../../queue/domain/types';

export const telnyxSendMessageQueueKey = 'telnyx-send-message';

export type TelnyxSendMessageQueueData = {
  text: string
  contacts: EntityId[]
  company: EntityId
}

export class TelnyxSendMessageQueueEvent implements QueueEvent<TelnyxSendMessageQueueData> {
  key = telnyxSendMessageQueueKey;

  constructor(readonly data: TelnyxSendMessageQueueData) {
  }

}
