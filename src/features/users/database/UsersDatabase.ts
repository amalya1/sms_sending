import { EntityId, Optional, OptionalId } from '../../../common/types/entity.types';
import { ContextRepo } from '../../../common/types/repository.types';
import { filterNotNull, requireNotNull } from '../../../common/utils/utils.base';
import { repoMatch, repoMatchIds } from '../../../common/utils/utils.repo';
import { UserSearchArg } from '../repository/types';
import { UserEntityDb, UserEntityDbData } from './types';


export abstract class UsersDatabase {
  abstract list(ctx: ContextRepo, pks: OptionalId[]): Promise<Optional<UserEntityDb>[]>

  abstract listByEmail(ctx: ContextRepo, emails: string[]): Promise<OptionalId[]>

  abstract add(ctx: ContextRepo, input: UserEntityDbData): Promise<UserEntityDb>

  abstract update(ctx: ContextRepo, userId: EntityId, input: UserEntityDbData): Promise<void>

  abstract listByCode(ctx: ContextRepo, codes: string[]): Promise<OptionalId[]>

  abstract search(ctx: ContextRepo, input: UserSearchArg): Promise<[EntityId[], number]>

}


export class UsersDatabaseImpl implements UsersDatabase {


  async list(ctx: ContextRepo, pks: OptionalId[]): Promise<Optional<UserEntityDb>[]> {
    if (pks.length == 0) return [];
    const query = ctx.sql<UserEntityDb[]>`
        select id,
               email,
               phone_number,
               status,
               type,
               password,
               first_name,
               last_name,
               created_by,
               reset_password_token,
               reset_password_token_expire,
               created_at,
               updated_at,
               deleted_at
        from users
        where id = any (${filterNotNull(pks)}::uuid[])
    `;
    return repoMatchIds(pks, await query);
  }


  async listByEmail(ctx: ContextRepo, emails: string[]): Promise<OptionalId[]> {
    if (emails.length == 0) return [];
    const rows = await ctx.sql<{ id: EntityId, email: string }[]>`
        select id,
               email
        from users
        where email = any (${emails});
    `;
    return repoMatch(
      emails,
      rows,
      (r) => r.email,
      (r) => r.id,
      null,
    );
  }

  async listByCode(ctx: ContextRepo, codes: string[]): Promise<OptionalId[]> {
    if (codes.length == 0) return [];
    const rows = await ctx.sql<{ id: EntityId, reset_password_token: string }[]>`
        select id,
               reset_password_token
        from users
        where reset_password_token = any (${codes});
    `;
    return repoMatch(
      codes,
      rows,
      (r) => r.reset_password_token,
      (r) => r.id,
      null,
    );
  }

  async add(ctx: ContextRepo, input: UserEntityDbData): Promise<UserEntityDb> {
    const query = ctx.sql<{ id: EntityId }[]>`
        insert into users (email,
                           phone_number,
                           status,
                           type,
                           password,
                           first_name,
                           last_name,
                           created_by,
                           reset_password_token,
                           reset_password_token_expire,
                           created_at,
                           updated_at,
                           deleted_at)
        values (${input.email},
                ${input.phone_number},
                ${input.status},
                ${input.type},
                ${input.password},
                ${input.first_name},
                ${input.last_name},
                ${input.created_by},
                ${input.reset_password_token},
                ${input.reset_password_token_expire},
                now(),
                now(),
                ${input.deleted_at})
        returning id;
    `;
    const [{ id: id }] = await query;
    const [item] = await this.list(ctx, [id]);
    return requireNotNull(item);
  }

  async update(ctx: ContextRepo, userId: EntityId, input: UserEntityDbData): Promise<void> {
    await ctx.sql<never>`
        update users
        set status                      = ${input.status},
            type                        = ${input.type},
            password                    = ${input.password},
            phone_number                = ${input.phone_number},
            first_name                  = ${input.first_name},
            last_name                   = ${input.last_name},
            reset_password_token        = ${input.reset_password_token},
            reset_password_token_expire = ${input.reset_password_token_expire},
            updated_at                  = now(),
            deleted_at                  = ${input.deleted_at}
        where id = ${userId};
    `;
  }

  async search(ctx: ContextRepo, input: UserSearchArg): Promise<[EntityId[], number]> {
    const type = ctx.sql`${input.type}::user_type[]`;
    const users = ctx.sql`${input.users}::uuid[]`;
    const companies = ctx.sql`${input.companies}::uuid[]`;
    const roles = ctx.sql`${input.roles}::uuid[]`;
    const nameParts = (input.query || '')
      .split(' ')
      .map(s => s.toLowerCase());

    const rows = await ctx.sql<{ user_id: EntityId, count: number }[]>`
        select u.id               as user_id,
               (count(*) over ()) as count
        from users u
                 left join company_user cu on u.id = cu.user_id and cardinality(${companies}) != 0
        where true
          and u.status = 'active'
          and (cardinality(${type}) = 0 or u.type = any (${type}))
          and (cardinality(${companies}) = 0 or cu.company_id = any (${companies}))
          and (cardinality(${users}) = 0 or u.id = any (${users}))
          and (cardinality(${roles}) = 0 or cu.role_id = any (${roles}))
          and (
            coalesce(cardinality(${nameParts}::text[]), 0) = 0
                or lower(u.first_name || u.last_name) like all
                   (select '%' || q || '%' from unnest(${nameParts}::text[]) q)
            )
        order by lower(u.first_name || u.last_name) asc
        limit ${input.limit} offset ${input.offset}
    `;

    const count = rows.count > 0 ? rows[0].count : 0;
    return [
      rows.map((row) => row.user_id),
      count,
    ];
  }
}
