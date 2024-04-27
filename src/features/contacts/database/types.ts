import { EntityId, JSONValue, Optional, OptionalId } from '../../../common/types/entity.types';
import { ContactSourceType, ContactStatus, ContactValidStatus } from '../contacts.types';

export type ContactEntityDb = ContactEntityDbData & {
  id: EntityId;
  created_at: Date;
  updated_at: Date;
}

export type ContactEntityDbData = {
  status: ContactStatus;
  valid_status: ContactValidStatus;
  company_id: EntityId;
  phone_number: string;
  email: Optional<string>;
  first_name: Optional<string>;
  last_name: Optional<string>;
  birthdate: Optional<Date>;
  contact_metadata: Optional<{ [x: string]: JSONValue }>;
  time_zone: Optional<string>;
  opt_in_type: ContactSourceType;
  opt_in_date: Date;
  opt_out_type: Optional<ContactSourceType>;
  opt_out_date: Optional<Date>;
  created_by: OptionalId;
  updated_by: OptionalId;
  deleted_at: Optional<Date>;
}
