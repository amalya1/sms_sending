import { UserEntityDb, UserEntityDbData } from '../database/types';
import { UserEntity } from '../domain/types';

export class UserDbToEntityMapper {
  map(entityDb: UserEntityDb): UserEntity {
    return new UserEntity(
      entityDb.id,
      entityDb.email,
      entityDb.phone_number,
      entityDb.status,
      entityDb.type,
      entityDb.password,
      entityDb.first_name,
      entityDb.last_name,
      entityDb.created_by,
      entityDb.updated_by,
      entityDb.reset_password_token,
      entityDb.reset_password_token_expire,
      entityDb.created_at,
      entityDb.updated_at,
      entityDb.deleted_at,
    );
  }
}

export class UserEntityToDbMapper {
  map(entity: UserEntity): UserEntityDbData {
    return {
      status: entity.status,
      type: entity.type,
      email: entity.email,
      phone_number: entity.phoneNumber,
      password: entity.password,
      first_name: entity.firstName,
      last_name: entity.lastName,
      created_by: entity.createdBy,
      updated_by: entity.updatedBy,
      reset_password_token: entity.resetPasswordToken,
      reset_password_token_expire: entity.resetPasswordTokenExpire,
      deleted_at: entity.deletedAt,
    }
  }
}


