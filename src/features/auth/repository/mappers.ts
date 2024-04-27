import { RefreshTokenDb } from '../database/types';
import { RefreshTokenEntity } from '../domain/types';

export class AuthDbToEntityMapper {
  map(entityDb: RefreshTokenDb): RefreshTokenEntity {
    return new RefreshTokenEntity(
      entityDb.id,
      entityDb.token,
      entityDb.user_id,
      entityDb.created_at,
      entityDb.updated_at
    );
  }
}
