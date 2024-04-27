import { EntityId, Optional, OptionalId } from '../../../common/types/entity.types';
import { UserStatus, UserType } from '../users.types';

export type UserEntityDb = UserEntityDbData & {
  id: EntityId;
  created_at: Date;
  updated_at: Date;
}

export type UserEntityDbData = {
  email: string;
  phone_number: Optional<string>;
  status: UserStatus;
  type: UserType;
  first_name: string;
  last_name: string;
  created_by: OptionalId;
  updated_by: OptionalId;
  reset_password_token: Optional<string>;
  reset_password_token_expire: Optional<Date>;
  password: Optional<string>;
  deleted_at: Optional<Date>;
}
