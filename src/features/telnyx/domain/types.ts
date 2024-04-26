import { EntityId } from '../../../common/types/entity.types';
import { TelnyxWebhookApi } from '../api/types';

export type TelnyxMessageStatusType =
  | 'queued'
  | 'sending'
  | 'sent'
  | 'expired'
  | 'sending_failed'
  | 'delivery_unconfirmed'
  | 'delivered'
  | 'delivery_failed'

export type TelnyxMessageEntity = {
  id: EntityId
  externalId: EntityId
  senderPhone: string
  receiverPhone: string
}

export type TelnyxMessageData = {
  externalId: EntityId
  receiverPhone: string
}

export type TelnyxSendMessageArgs = {
  text: string
  receiversPhones: string[]
  senderPhone: string
}

export type TelnyxWebhookInput = {
  data: TelnyxWebhookApi
  raw: unknown
  signature: string
  timestamp: number
}

export type TelnyxCreateMessagesArgs = {
  externalId: EntityId
  senderPhone: string
  receiverPhone: string
}[]

export type TelnyxSendMessagesInput = {
  text: string
  contacts: EntityId[]
  company: EntityId
}
