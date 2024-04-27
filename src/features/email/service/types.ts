import { EntityId } from '../../../common/types/entity.types';


export interface EmailEvent<Data> {
  type: EmailEventType;
  data: Data;
}

export const EmailEventTypeOptions = [
  'CreateUserEvent',
  'InviteUserEvent',
  'ForgotPasswordEvent',
] as const;
export type EmailEventType = (typeof EmailEventTypeOptions)[number]

export type EmailEventData = CreateUserEventData | InviteUserEventData | ForgotPasswordEventData;



export class CreateUserEvent implements EmailEvent<CreateUserEventData> {
  public readonly type: EmailEventType = 'CreateUserEvent';
  constructor(public readonly data: CreateUserEventData) {}
}
export type CreateUserEventData = {
  userId: EntityId
}



export class InviteUserEvent implements EmailEvent<InviteUserEventData> {
  public readonly type: EmailEventType = 'InviteUserEvent';
  constructor(public readonly data: InviteUserEventData) {}
}
export type InviteUserEventData = {
  userId: EntityId
  companyId: EntityId
}

export class ForgotPasswordEvent implements EmailEvent<ForgotPasswordEventData> {
  public readonly type: EmailEventType = 'ForgotPasswordEvent';
  constructor(public readonly data: ForgotPasswordEventData) {}
}
export type ForgotPasswordEventData = {
  userId: EntityId;
};



