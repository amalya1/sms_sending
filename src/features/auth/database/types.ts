import { EntityId } from '../../../common/types/entity.types';

export type RefreshTokenDb = RefreshTokenDbData & {
  id: EntityId;
  created_at: Date;
  updated_at: Date;
}

export type RefreshTokenDbData = {
  token: string;
  user_id: EntityId;
}
