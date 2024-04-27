import { EntityId, JSONValue, Optional, OptionalId } from '../../../common/types/entity.types';
import { ContextRepo } from '../../../common/types/repository.types';
import { filterNotNull, requireNotNulls } from '../../../common/utils/utils.base';
import { repoMatch, repoMatchIds } from '../../../common/utils/utils.repo';
import { ContactEntityDb, ContactEntityDbData } from './types';
import { ContactSearch } from '../repository/types';


export abstract class ContactsDatabase {
  abstract list(ctx: ContextRepo, pks: OptionalId[]): Promise<Optional<ContactEntityDb>[]>

  abstract add(ctx: ContextRepo, input: ContactEntityDbData[]): Promise<EntityId[]>

  abstract update(ctx: ContextRepo, contactId: EntityId, input: ContactEntityDbData): Promise<void>

  abstract getByCompanyAndPhone(ctx: ContextRepo, companyId: EntityId, phoneNumbers: string[]): Promise<OptionalId[]>

  abstract search(ctx: ContextRepo, input: ContactSearch): Promise<[ContactEntityDb[], number]>

  abstract markDeleted(ctx: ContextRepo, userId: EntityId, pks: EntityId[]): Promise<void>

  abstract restore(ctx: ContextRepo, userId: EntityId, pks: EntityId[]): Promise<void>
}


export class ContactsDatabaseImpl implements ContactsDatabase {

  async list(ctx: ContextRepo, pks: OptionalId[]): Promise<Optional<ContactEntityDb>[]> {
    if (pks.length == 0) return [];
    const query = ctx.sql<ContactEntityDb[]>`
        select id,
               status,
               valid_status,
               company_id,
               phone_number,
               email,
               first_name,
               last_name,
               birthdate,
               contact_metadata,
               time_zone,
               opt_in_type,
               opt_in_date,
               opt_out_type,
               opt_out_date,
               created_by,
               updated_by,
               created_at,
               updated_at,
               deleted_at
        from contacts
        where id = any (${filterNotNull(pks)}::uuid[])
    `;
    return repoMatchIds(pks, await query);
  }

  async add(ctx: ContextRepo, input: ContactEntityDbData[]): Promise<EntityId[]>{
    if (input.length == 0) return [];
    const contacts = input.map(i => ({
      id: ctx.sql`gen_random_uuid()`,
      status: i.status,
      valid_status: i.valid_status,
      company_id: i.company_id,
      phone_number: i.phone_number,
      email: i.email,
      first_name: i.first_name,
      last_name: i.last_name,
      birthdate: i.birthdate,
      contact_metadata: i.contact_metadata,
      time_zone: i.time_zone,
      opt_in_type: i.opt_in_type,
      opt_in_date: i.opt_in_date,
      opt_out_type: i.opt_out_type,
      opt_out_date: i.opt_out_date,
      created_by: i.created_by,
      updated_by: i.updated_by,
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: i.deleted_at,
    }));
    const columns = Object.keys(contacts[0]) as Array<keyof typeof contacts[0]>;

    const query = await ctx.sql<{id: EntityId }[]>`
        insert into contacts ${ctx.sql(contacts, ...columns)}
        returning id
    `;

    return query.map(q => q.id);
  }

  async update(ctx: ContextRepo, contactId: EntityId, input: ContactEntityDbData): Promise<void> {
    const contact_metadata: JSONValue = {
      ...input.contact_metadata,
    };
    await ctx.sql<never>`
      update contacts
      set status = ${input.status},
          valid_status = ${input.valid_status},
          phone_number = ${input.phone_number},
          email = ${input.email},
          first_name = ${input.first_name},
          last_name = ${input.last_name},
          birthdate = ${input.birthdate},
          contact_metadata = ${ctx.sql.json(contact_metadata)},
          time_zone = ${input.time_zone},
          opt_out_type = ${input.opt_out_type},
          opt_out_date = ${input.opt_out_date},
          updated_by = ${input.updated_by},
          updated_at = now(),
          deleted_at = ${input.deleted_at}
      where id = ${contactId};
    `;
  }

  async getByCompanyAndPhone(ctx: ContextRepo, companyId: EntityId, phoneNumbers: string[]): Promise<OptionalId[]> {
    if (phoneNumbers.length == 0) return [];

    const query = await ctx.sql<{ id: EntityId, phone_number: string }[]>`
      select id,
             phone_number
      from contacts
      where company_id = ${companyId}
        and phone_number = any (${phoneNumbers});
  `;
    return repoMatch(
      phoneNumbers,
      await query,
      (r) => r.phone_number,
      (r) => r.id,
      null,
    );
  }

  async search(ctx: ContextRepo, input: ContactSearch): Promise<[ContactEntityDb[], number]> {
    const contacts = ctx.sql`${input.contacts}::uuid[]`;
    const companies = ctx.sql`${input.companies}::uuid[]`;
    const groups = ctx.sql`${input.groups}::uuid[]`;
    const notInGroups = ctx.sql`${input.notInGroups}::uuid[]`;
    const validStatus = ctx.sql`${input.validStatus}::contact_valid_status[]`;

    const rows = await ctx.sql<{ contact_id: EntityId, count: number }[]>`
      select c.id               as contact_id,
             (count(*) over ()) as count
      from contacts c
            left join contact_group cg on c.id = cg.contact_id and cardinality(${groups}) != 0
      where true
        and c.status = 'active'
        and (cardinality(${companies}) = 0 or c.company_id = any(${companies}))  
        and (cardinality(${contacts}) = 0 or c.id = any(${contacts}))
        and (cardinality(${groups}) = 0 or cg.group_id = any(${groups}))
        and (cardinality(${notInGroups}) = 0 or c.id != all(
                                                select contact_id from contact_group where group_id = any(${notInGroups})))
        and (cardinality(${validStatus}) = 0 or c.valid_status = any(${validStatus}))
      group by c.id
      order by c.created_at desc
      limit ${input.limit} offset ${input.offset}
    `;

    const count = rows.count > 0 ? rows[0].count : 0;
    const items = requireNotNulls(await this.list(ctx, rows.map((row) => row.contact_id)));
    return [items, count];
  }


  async markDeleted(ctx: ContextRepo, userId: EntityId, pks: EntityId[]): Promise<void> {
    if (pks.length == 0) {
      return;
    }
    await ctx.sql`
        update contacts
        set status       = 'deleted',
            updated_by   = ${userId}::uuid,
            updated_at   = now(),
            deleted_at   = now()
        where id = any (${pks}::uuid[]);
    `;
  }

  async restore(ctx: ContextRepo, userId: EntityId, pks: EntityId[]): Promise<void> {
    if (pks.length == 0) {
      return;
    }
    await ctx.sql`
        update contacts
        set status       = 'active',
            updated_by   = ${userId}::uuid,
            updated_at   = now(),
            deleted_at   = null
        where true
          and id = any (${pks}::uuid[]);
    `;
  }
}
