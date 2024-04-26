import { Optional } from '../../../common/types/entity.types';

export type TelnyxMessageApi = {
  id: string
  to: TelnyxReceiverApi[]
  sent_at: string
  received_at: string
  completed_at: string
}

export type TelnyxReceiverApi = {
  phone_number: string
  status: string
}

export type TelnyxMessageTypeApi =
  | 'SMS'
  | 'MMS'

export type TelnyxWebhookApi = {
  data: {
    id: string
    occurred_at: string
    payload: TelnyxMessageApi
  }
}

export type TelnyxSendMessageInputApi = {
  from: string
  to: string[]
  text: string
  subject: Optional<string>
  webhook_url: Optional<string>
  type: TelnyxMessageTypeApi
}
