import { EntityId } from '../../../common/types/entity.types';

export type RefreshTokenAdd = {
  token: string;
  userId: EntityId,
}
