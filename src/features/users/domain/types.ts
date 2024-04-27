import { EntityId, Optional, OptionalId } from '../../../common/types/entity.types';
import { UserStatus, UserType } from '../users.types';

export class UserEntity {
  constructor(
    public id: EntityId,
    public email: string,
    public phoneNumber: Optional<string>,
    public status: UserStatus,
    public type: UserType,
    public password: Optional<string>,
    public firstName: string,
    public lastName: string,
    public createdBy: OptionalId,
    public updatedBy: OptionalId,
    public resetPasswordToken: Optional<string>,
    public resetPasswordTokenExpire: Optional<Date>,
    public createdAt: Date,
    public updatedAt: Date,
    public deletedAt: Optional<Date>,
  ) {
  }

  setPassword(password: string, updatedBy: EntityId): UserEntity {
    const clone = this.clone();
    clone.password = password;
    clone.updatedBy = updatedBy;
    return clone;
  }

  setResetToken(resetPasswordToken: Optional<string>, resetPasswordTokenExpire: Optional<Date>, updatedBy: EntityId): UserEntity {
    const clone = this.clone();
    clone.resetPasswordToken = resetPasswordToken;
    clone.resetPasswordTokenExpire = resetPasswordTokenExpire;
    clone.updatedBy = updatedBy;
    return clone;
  }

  setNames(firstName: string, lastName: string, updatedBy: EntityId): UserEntity {
    const clone = this.clone();
    clone.firstName = firstName;
    clone.lastName = lastName;
    clone.updatedBy = updatedBy;
    return clone;
  }

  setPhoneNumber(phoneNumber: Optional<string>, updatedBy: EntityId): UserEntity {
    const clone = this.clone();
    clone.phoneNumber = phoneNumber;
    clone.updatedBy = updatedBy;
    return clone;
  }

  protected clone(): UserEntity {
    return new UserEntity(
      this.id,
      this.email,
      this.phoneNumber,
      this.status,
      this.type,
      this.password,
      this.firstName,
      this.lastName,
      this.createdBy,
      this.updatedBy,
      this.resetPasswordToken,
      this.resetPasswordTokenExpire,
      this.createdAt,
      this.updatedAt,
      this.deletedAt,
    );
  }
}


export type UserInviteInput = {
  email: string;
  phoneNumber: Optional<string>;
  firstName: string,
  lastName: string,
  roleId: EntityId
}

export type UserChangeRoleInput = {
  userId: EntityId
  roleId: EntityId
}

export type UserChangePasswordInput = {
  userId: EntityId
  currentPassword: string
  password: string
}

export type UserUpdateInput = {
  userId: EntityId
  firstName: string
  lastName: string
  phoneNumber: Optional<string>;
}

export type UserSearchInput = {
  companyId: EntityId;
  limit: number;
  offset: number;
  query: string;
  roleId: Optional<EntityId>;
}
