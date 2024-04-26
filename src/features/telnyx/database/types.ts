import { JSONValue } from 'postgres';
import { EntityId } from '../../../common/types/entity.types';

export type TelnyxAddDbArgs = {
  external_id: string
  phone_sender: string
  phone_receiver: string
  meta: JSONValue
}[]

export type TelnyxMessageDb = {
  id: EntityId
  external_id: string
  phone_sender: string
  phone_receiver: string
  meta: JSONValue
  date_created: Date
  date_updated: Date
}
