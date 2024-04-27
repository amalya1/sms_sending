import { EntityId, JSONValue, Optional, OptionalId } from '../../../common/types/entity.types';
import { ContactSourceType, ContactStatus, ContactValidStatus } from '../contacts.types';


export class ContactEntity {
  constructor(
    public id: EntityId,
    public status: ContactStatus,
    public validStatus: ContactValidStatus,
    public companyId: EntityId,
    public phoneNumber: string,
    public email: Optional<string>,
    public firstName: Optional<string>,
    public lastName: Optional<string>,
    public birthdate: Optional<Date>,
    public contactMetadata: Optional<{ [x: string]: JSONValue }>,
    public timeZone: Optional<string>,
    public optInType: ContactSourceType,
    public optInDate: Date,
    public optOutType: Optional<ContactSourceType>,
    public optOutDate: Optional<Date>,
    public createdBy: OptionalId,
    public updatedBy: OptionalId,
    public createdAt: Date,
    public updatedAt: Date,
    public deletedAt: Optional<Date>,
  ) {
  }

  protected clone(): ContactEntity {
    return new ContactEntity(
      this.id,
      this.status,
      this.validStatus,
      this.companyId,
      this.phoneNumber,
      this.email,
      this.firstName,
      this.lastName,
      this.birthdate,
      this.contactMetadata,
      this.timeZone,
      this.optInType,
      this.optInDate,
      this.optOutType,
      this.optOutDate,
      this.createdBy,
      this.updatedBy,
      this.createdAt,
      this.updatedAt,
      this.deletedAt,
    );
  }

  setContactData(
    phoneNumber: string,
    firstName: Optional<string>,
    lastName: Optional<string>,
    email: Optional<string>,
    birthdate: Optional<Date>,
    contactMetadata: Optional<{ [x: string]: JSONValue }>,
    timeZone: Optional<string>,
    updatedBy: EntityId,
  ): ContactEntity {
    const clone = this.clone();
    clone.phoneNumber = phoneNumber;
    clone.firstName = firstName;
    clone.lastName = lastName;
    clone.email = email;
    clone.birthdate = birthdate;
    clone.contactMetadata = contactMetadata;
    clone.timeZone = timeZone;
    clone.updatedBy = updatedBy;
    return clone;
  }
}

export type ContactsAddInput = {
  phoneNumber: string;
  email: Optional<string>;
  firstName: Optional<string>;
  lastName: Optional<string>;
  birthdate: Optional<Date>;
  contactMetadata: Optional<{ [x: string]: JSONValue }>;
  timeZone: Optional<string>;
}

export type ContactUpdateInput = {
  contactId: EntityId;
  phoneNumber: string;
  email: Optional<string>;
  firstName: Optional<string>;
  lastName: Optional<string>;
  birthdate: Optional<Date>;
  contactMetadata: Optional<{ [x: string]: JSONValue }>;
  timeZone: Optional<string>;
}

export type ContactSearchInput = {
  validStatus: ContactValidStatus[];
  companyId: EntityId;
  groups: EntityId[];
  notInGroups: EntityId[];
  limit: number;
  offset: number;
}

export type ContactsUploadCSVOutput = {
  createdContacts: ContactEntity[];
  existedContacts: ContactEntity[];
  invalidContacts: ContactEntity[];
  repeatedContacts: ContactEntity[];
}
