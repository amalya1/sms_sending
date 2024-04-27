import { Optional, OptionalId } from '../../../common/types/entity.types';
import { ContextRepo } from '../../../common/types/repository.types';
import { RefreshTokenEntity } from './types';
import { RefreshTokenAdd } from '../repository/types';

export abstract class AuthRepository {
  abstract listRefreshToken(ctx: ContextRepo, pks: OptionalId[]): Promise<Optional<RefreshTokenEntity>[]>

  abstract addRefreshToken(ctx: ContextRepo, input: RefreshTokenAdd): Promise<RefreshTokenEntity>

  abstract listByRefreshToken(ctx: ContextRepo, token: string[]): Promise<Optional<RefreshTokenEntity>[]>

  abstract deleteRefreshToken(ctx: ContextRepo, tokens: string[]): Promise<void>
}

