import { EntityId, Optional, OptionalId } from '../../../common/types/entity.types';
import { UserStatus, UserType } from '../users.types';

export type UserAdd = {
  email: string;
  phoneNumber: Optional<string>;
  status: UserStatus;
  type: UserType;
  password: Optional<string>;
  firstName: string,
  lastName: string,
  createdBy: OptionalId,
  resetPasswordToken: Optional<string>,
  resetPasswordTokenExpire: Optional<Date>,
}

export type UserSearchArg = {
  users: EntityId[]
  type: UserType[];
  companies: EntityId[];
  roles: EntityId[];
  limit: number;
  offset: number;
  query: Optional<string>;
}

export type UserGetForCompanyArg = {
  userId: EntityId
  companyId: EntityId
}
