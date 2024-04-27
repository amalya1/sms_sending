import { ApiError, errorConflict, errorNotFound } from '../../../common/errors/errors.types';
import { EntityId } from '../../../common/types/entity.types';


export function errorContactNotFound(contactId: EntityId): ApiError {
  return errorNotFound(`contact:${contactId}`);
}

export function errorContactConflict(contactId: EntityId): ApiError {
  return errorConflict(`contact:${contactId}`);
}
