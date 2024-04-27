import { EntityId, Optional, OptionalId } from '../../../common/types/entity.types';
import { ContextRepo } from '../../../common/types/repository.types';
import { filterNotNull, requireNotNull } from '../../../common/utils/utils.base';
import { repoMatch, repoMatchIds } from '../../../common/utils/utils.repo';
import { RefreshTokenDb, RefreshTokenDbData } from './types';



export abstract class AuthDatabase {
  abstract listRefreshToken(ctx: ContextRepo, pks: OptionalId[]): Promise<Optional<RefreshTokenDb>[]>

  abstract addRefreshToken(ctx: ContextRepo, input: RefreshTokenDbData): Promise<RefreshTokenDb>

  abstract listByRefreshToken(ctx: ContextRepo, token: string[]): Promise<OptionalId[]>

  abstract deleteRefreshToken(ctx: ContextRepo, tokens: string[]): Promise<void>

}

export class AuthDatabaseImpl implements AuthDatabase {

  async listRefreshToken(ctx: ContextRepo, pks: OptionalId[]): Promise<Optional<RefreshTokenDb>[]> {
    if (pks.length == 0) return [];
    const query = ctx.sql<RefreshTokenDb[]>`
        select id,
               user_id,
               token,
               created_at,
               updated_at
        from refresh_token
        where id = any (${filterNotNull(pks)}::uuid[])
    `;
    return repoMatchIds(pks, await query);
  }

  async addRefreshToken(ctx: ContextRepo, input: RefreshTokenDbData): Promise<RefreshTokenDb> {
    const query = ctx.sql<{ id: EntityId }[]>`
    insert into refresh_token (token,
                               user_id,
                               created_at,
                               updated_at)
    values (${input.token},  
            ${input.user_id}, 
            now(),
            now())
    returning id;
  `;
    const [{ id: id }] = await query;
    const [item] = await this.listRefreshToken(ctx, [id]);
    return requireNotNull(item);
  }

  async listByRefreshToken(ctx: ContextRepo, tokens: string[]): Promise<OptionalId[]> {
    const rows = await ctx.sql<{ id: EntityId, token: string }[]>`
      select id,
             token
      from refresh_token
      where token = any (${ tokens })
`;
    return repoMatch(
      tokens,
      rows,
      (r) => r.token,
      (r) => r.id,
      null
    );
  }

  async deleteRefreshToken(ctx: ContextRepo, tokens: string[]): Promise<void> {
    await ctx.sql`
    delete from refresh_token
    where token = any (${ tokens })
  `;
  }
}
