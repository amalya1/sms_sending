import { EntityId, JSONValue } from '../../../common/types/entity.types';

export type EmailPayload = EmailTextPayload | EmailDynamicTemplatePayload

export type EmailTextPayload = {
  subject: string,
  text: string,
}

export type EmailDynamicTemplatePayload = {
  templateId: string,
  dynamicTemplateData: DynamicTemplateData,
}

export type DynamicTemplateData = { subject: string } & Record<string, JSONValue>


export type EmailSendData = {
  userId: EntityId,
  payload: EmailPayload,
}
