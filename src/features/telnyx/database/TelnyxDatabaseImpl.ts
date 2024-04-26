import { EntityId, Optional } from '../../../common/types/entity.types';
import { ContextRepo } from '../../../common/types/repository.types';
import { filterNotNull, requireNotNulls } from '../../../common/utils/utils.base';
import { repoMatchIds } from '../../../common/utils/utils.repo';
import { TelnyxDatabase } from './TelnyxDatabase';
import { TelnyxAddDbArgs, TelnyxMessageDb } from './types';

export class TelnyxDatabaseImpl implements TelnyxDatabase {

  async add(ctx: ContextRepo, args: TelnyxAddDbArgs): Promise<TelnyxMessageDb[]> {
    const data = args.map(a => {
      return {
        id: ctx.sql`gen_random_uuid()`,
        external_id: a.external_id,
        phone_sender: a.phone_sender,
        phone_receiver: a.phone_receiver,
        meta: ctx.sql.json(a.meta),
        date_created: ctx.sql`now()`,
        date_updated: ctx.sql`now()`,
      };
    });
    const columns = Object.keys(data[0]) as Array<keyof typeof data[0]>;
    const rows = await ctx.sql<{ id: string }[]>`
        insert into message_provider_telnyx ${ctx.sql(data, ...columns)}
            returning id;
    `;
    return requireNotNulls(
      await this.list(ctx, rows.map(r => r.id)),
    );
  }

  async list(ctx: ContextRepo, args: Optional<EntityId>[]): Promise<Optional<TelnyxMessageDb>[]> {
    const pks = filterNotNull(args);
    if (pks.length == 0) {
      return args.map(() => null);
    }
    const rows = await ctx.sql<TelnyxMessageDb[]>`
        select id,
               external_id,
               phone_sender,
               phone_receiver,
               meta,
               date_created,
               date_updated
        from message_provider_telnyx
        where true
          and id = any (${pks});
    `;
    return repoMatchIds(args, rows);
  }

  async updateStatus(
    ctx: ContextRepo,
    externalId: string,
    args: { phone: string; status: string }[],
  ): Promise<void> {
    const json = ctx.sql.json(args);
    await ctx.sql`
        with update_rows as (select ${externalId} as external_id,
                                    phone         as phone,
                                    status        as status
                             from jsonb_to_recordset(${json}) as x(phone text, status text))
        update message_provider_telnyx as telnyx
        set date_updated = now(),
            status       = r.status
        from (select * from update_rows) as r
        where true
          and telnyx.external_id = r.external_id
          and telnyx.phone_receiver = r.phone
        returning id;
    `;
  }

}
