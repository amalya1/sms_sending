import { Inject } from '@nestjs/common';
import { EntityId, Optional, OptionalId } from '../../../common/types/entity.types';
import { ContextRepo } from '../../../common/types/repository.types';
import { ContactsDatabase } from '../database/ContactsDatabase';
import { ContactsRepository } from '../domain/ContactsRepository';
import { ContactDbToEntityMapper, ContactEntityToDbMapper } from './mappers';
import { ContactEntity } from '../domain/types';
import { ContactAdd, ContactRestoreArgs, ContactSearch, ContactSoftDeleteArgs } from './types';
import { requireNotNulls } from '../../../common/utils/utils.base';


export class ContactsRepositoryImpl implements ContactsRepository {

  constructor(
    @Inject(ContactDbToEntityMapper) private readonly contactDbToEntityMapper: ContactDbToEntityMapper,
    @Inject(ContactEntityToDbMapper) private readonly contactEntityToDbMapper: ContactEntityToDbMapper,
    @Inject(ContactsDatabase) private readonly contactsDatabase: ContactsDatabase,
  ) {

  }


  async list(ctx: ContextRepo, pks: OptionalId[]): Promise<Optional<ContactEntity>[]> {
    const entitiesDb = await this.contactsDatabase.list(ctx, pks);
    return entitiesDb
      .map(db => db != null ? this.contactDbToEntityMapper.map(db) : null);
  }

  async add(ctx: ContextRepo, input: ContactAdd[]): Promise<ContactEntity[]> {
    const entityIds = await this.contactsDatabase.add(ctx, input.map(i => ({
      status: i.status,
      valid_status: i.validStatus,
      company_id: i.companyId,
      phone_number: i.phoneNumber,
      email: i.email,
      first_name: i.firstName,
      last_name: i.lastName,
      birthdate: i.birthdate,
      contact_metadata: i.contactMetadata,
      time_zone: i.timeZone,
      opt_in_type: i.optInType,
      opt_in_date: new Date(),
      opt_out_type: null,
      opt_out_date: null,
      created_by: i.createdBy,
      updated_by: i.createdBy,
      deleted_at: null,
    })));
    return requireNotNulls(await this.list(ctx, entityIds));
  }

  async update(ctx: ContextRepo, contact: ContactEntity): Promise<ContactEntity> {
    await this.contactsDatabase.update(
      ctx,
      contact.id,
      this.contactEntityToDbMapper.map(contact),
    )
    const [entity] = requireNotNulls(await this.list(ctx, [contact.id]));
    return entity;
  }

  async getByCompanyAndPhone(ctx: ContextRepo, companyId: EntityId, phoneNumbers: string[]): Promise<Optional<ContactEntity>[]> {
    const entityIds = await this.contactsDatabase.getByCompanyAndPhone(ctx, companyId, phoneNumbers);
    return await this.list(ctx, entityIds);
  }

  async search(ctx: ContextRepo, input: ContactSearch): Promise<[ContactEntity[], number]> {
    const [entitiesDb, count] = await this.contactsDatabase.search(ctx, {
      validStatus: input.validStatus,
      companies: input.companies,
      groups: input.groups,
      notInGroups: input.notInGroups,
      contacts: input.contacts,
      limit: input.limit,
      offset: input.offset,
    });
    return [entitiesDb
      .map((db) => this.contactDbToEntityMapper.map(db)), count];
  }


  async deleteSoft(ctx: ContextRepo, args: ContactSoftDeleteArgs): Promise<void> {
    await this.contactsDatabase.markDeleted(ctx, args.userId, args.contactIds);
  }

  async restore(ctx: ContextRepo, args: ContactRestoreArgs): Promise<ContactEntity[]> {
    await this.contactsDatabase.restore(ctx, args.userId, args.contactIds);
    return requireNotNulls(await this.list(ctx, args.contactIds));
  }
}
