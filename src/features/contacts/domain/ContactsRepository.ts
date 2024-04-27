import { EntityId, Optional, OptionalId } from '../../../common/types/entity.types';
import { ContextRepo } from '../../../common/types/repository.types';
import { ContactEntity } from './types';
import { ContactAdd, ContactRestoreArgs, ContactSearch, ContactSoftDeleteArgs } from '../repository/types';

export abstract class ContactsRepository {
  abstract list(ctx: ContextRepo, pks: OptionalId[]): Promise<Optional<ContactEntity>[]>

  abstract add(ctx: ContextRepo, input: ContactAdd[]): Promise<ContactEntity[]>

  abstract update(ctx: ContextRepo, contact: ContactEntity): Promise<ContactEntity>

  abstract getByCompanyAndPhone(ctx: ContextRepo, companyId: EntityId, phoneNumbers: string[]): Promise<Optional<ContactEntity>[]>

  abstract search(ctx: ContextRepo, input: ContactSearch): Promise<[ContactEntity[], number]>

  abstract deleteSoft(ctx: ContextRepo, args: ContactSoftDeleteArgs): Promise<void>

  abstract restore(ctx: ContextRepo, args: ContactRestoreArgs): Promise<ContactEntity[]>

}
