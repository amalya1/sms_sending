import { EntityId } from '../../../common/types/entity.types';
import { UserEntity } from '../../users/domain/types';

export type AuthLoginInput = {
  email: string
  password: string
}

export type AuthRefreshTokenInput = {
  token: string
}

export class RefreshTokenEntity {
  constructor(
    public id: EntityId,
    public token: string,
    public userId: EntityId,
    public createdAt: Date,
    public updatedAt: Date,
  ) {
  }
}

export type AuthForgotPasswordInput = {
  email: string
}

export type AuthSetPasswordInput = {
  token: string
  password: string
}

export type AuthToken = {
  user: UserEntity
  accessToken: string,
  refreshToken: string
}
