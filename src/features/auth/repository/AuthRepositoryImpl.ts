import { Inject } from '@nestjs/common';
import { ContextRepo } from '../../../common/types/repository.types';
import { AuthDatabase } from '../database/AuthDatabase';
import { AuthDbToEntityMapper } from './mappers';
import { AuthRepository } from '../domain/AuthRepository';
import { Optional, OptionalId } from '../../../common/types/entity.types';
import { RefreshTokenEntity } from '../domain/types';
import { RefreshTokenAdd } from './types';


export class AuthRepositoryImpl implements AuthRepository {

  constructor(
    @Inject(AuthDbToEntityMapper) private readonly authDbToEntityMapper: AuthDbToEntityMapper,
    @Inject(AuthDatabase) private readonly authDatabase: AuthDatabase,
  ) {

  }

  
  async listRefreshToken(ctx: ContextRepo, pks: OptionalId[]): Promise<Optional<RefreshTokenEntity>[]> {
    const entitiesDb = await this.authDatabase.listRefreshToken(ctx, pks);
    return entitiesDb
      .map(db => db != null ? this.authDbToEntityMapper.map(db) : null);
  }

  async addRefreshToken(ctx: ContextRepo, input: RefreshTokenAdd): Promise<RefreshTokenEntity> {
    const entityDb = await this.authDatabase.addRefreshToken(ctx, {
      token: input.token,
      user_id: input.userId,
    });
    return this.authDbToEntityMapper.map(entityDb);
  }

  async listByRefreshToken(ctx: ContextRepo, tokens: string[]): Promise<Optional<RefreshTokenEntity>[]> {
    const entityIds = await this.authDatabase.listByRefreshToken(ctx, tokens);
    return await this.listRefreshToken(ctx, entityIds);
  }

  async deleteRefreshToken(ctx: ContextRepo, tokens: string[]): Promise<void> {
    return await this.authDatabase.deleteRefreshToken(ctx, tokens);
  }
}
