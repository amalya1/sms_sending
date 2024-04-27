import { EntityId, JSONValue, Optional, OptionalId } from '../../../common/types/entity.types';
import { ContactSourceType, ContactStatus, ContactValidStatus } from '../contacts.types';

export type ContactAdd = {
  status: ContactStatus;
  validStatus: ContactValidStatus;
  companyId: EntityId;
  phoneNumber: string;
  email: Optional<string>;
  firstName: Optional<string>;
  lastName: Optional<string>;
  birthdate: Optional<Date>;
  contactMetadata: Optional<{ [x: string]: JSONValue }>;
  timeZone: Optional<string>;
  optInType: ContactSourceType;
  createdBy: OptionalId;
}

export type ContactSearch = {
  validStatus: ContactValidStatus[];
  companies: EntityId[];
  contacts: EntityId[];
  groups: EntityId[];
  notInGroups: EntityId[];
  limit: number;
  offset: number;
}

export type ContactSoftDeleteArgs = {
  userId: EntityId
  contactIds: EntityId[]
}

export type ContactRestoreArgs = {
  userId: EntityId
  contactIds: EntityId[]
}
