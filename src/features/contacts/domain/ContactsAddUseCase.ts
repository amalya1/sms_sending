import { ContextRepo } from '../../../common/types/repository.types';
import { Inject } from '@nestjs/common';
import { ContactsRepository } from './ContactsRepository';
import { ContactEntity, ContactsAddInput } from './types';
import { ApiAuth } from '../../auth/auth.types';
import { EntityId } from '../../../common/types/entity.types';
import { AuthService } from '../../auth/service/AuthService';
import { errorContactConflict } from './errors';
import { filterNotNull, requireNotNulls } from '../../../common/utils/utils.base';
import { GroupsRepository } from '../../groups/domain/GroupsRepository';
import { errorValidation } from '../../../common/errors/errors.types';
import { ContactGroupRepository } from '../../contactGroup/domain/ContactGroupRepository';


export class ContactsAddUseCase {
  constructor(
    @Inject(AuthService) protected authService: AuthService,
    @Inject(ContactsRepository) protected contactsRepository: ContactsRepository,
    @Inject(GroupsRepository) protected groupsRepository: GroupsRepository,
    @Inject(ContactGroupRepository) protected contactGroupRepository: ContactGroupRepository,
  ) {
  }


  async invoke(ctx: ContextRepo, auth: ApiAuth, input: ContactsAddInput[], companyId: EntityId): Promise<ContactEntity[]> {
    await this.accessCheck(ctx, auth, companyId);

    const existing = await this.contactsRepository.getByCompanyAndPhone(ctx, companyId, input.map((c) => c.phoneNumber));
    existing.forEach(c => {
      if (c != null && c.status == 'active') throw errorContactConflict(c.phoneNumber);
    })

    const deletedContacts = filterNotNull(existing).filter((c) => c.status == 'deleted');
    const newContacts = input.filter((c, i) => existing[i] == null);


    const [[defaultGroup]] = await this.groupsRepository.search(ctx, {
      companies: [companyId],
      groups: [],
      types: ['default'],
      limit: 1,
      offset: 0,
    });
    if (defaultGroup == null) throw errorValidation('Invalid default group.');


    const createdContacts = await ctx.sql.begin(async (txSql) => {
      const txCtx = { ...ctx, sql: txSql };

      if (deletedContacts.length != 0) {
        await this.contactsRepository.restore(txCtx, { userId: auth.userId, contactIds: deletedContacts.map((c) => c.id) });
      }

      const createdContacts = await this.contactsRepository.add(txCtx, newContacts.map(i => ({
        status: 'active',
        validStatus: 'valid',
        companyId: companyId,
        phoneNumber: i.phoneNumber,
        email: i.email,
        firstName: i.firstName,
        lastName: i.lastName,
        birthdate: i.birthdate,
        contactMetadata: i.contactMetadata,
        timeZone: i.timeZone,
        optInType: 'company',
        createdBy: auth.userId,
      })));

      await this.contactGroupRepository.add(txCtx, createdContacts.map(c => ({
        contactId: c.id,
        groupId: defaultGroup.id,
        createdBy: auth.userId,
      })));

      return createdContacts;
    });


    if (deletedContacts.length != 0) {
      const restoredContacts = requireNotNulls(await this.contactsRepository.list(ctx, deletedContacts.map(c => c.id)));
      return [...createdContacts, ...restoredContacts];
    }

    return createdContacts;
  }


  private async accessCheck(ctx: ContextRepo, auth: ApiAuth, companyId: EntityId): Promise<void> {
    await this.authService.authFromCompanyUser(ctx, auth, companyId);
  }
}
