import { ApiError, errorConflict, errorNotFound } from '../../../common/errors/errors.types';
import { EntityId } from '../../../common/types/entity.types';

export function errorUserNotFound(userId: EntityId): ApiError {
  return errorNotFound(`user:${userId}`);
}

export function errorUserConflict(userId: EntityId): ApiError {
  return errorConflict(`user:${userId}`);
}
