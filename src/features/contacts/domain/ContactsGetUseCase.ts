import { ContextRepo } from '../../../common/types/repository.types';
import { ApiAuth } from '../../auth/auth.types';
import { Inject } from '@nestjs/common';
import { AuthService } from '../../auth/service/AuthService';
import { EntityId } from '../../../common/types/entity.types';
import { ContactsRepository } from './ContactsRepository';
import { ContactEntity } from './types';
import { errorContactNotFound } from './errors';


export class ContactsGetUseCase {
  constructor(
    @Inject(ContactsRepository) protected contactsRepository: ContactsRepository,
    @Inject(AuthService) protected authService: AuthService,
  ) {
  }


  async invoke(ctx: ContextRepo, auth: ApiAuth, contactId: EntityId, companyId: EntityId): Promise<ContactEntity>{
    await this.accessCheck(ctx, auth, companyId);

    const [[contact]] = await this.contactsRepository.search(ctx, {
      validStatus: [],
      companies: [companyId],
      contacts: [contactId],
      groups: [],
      notInGroups: [],
      limit: 1,
      offset: 0,
    });
    if (contact == null) throw errorContactNotFound(contactId);

    return contact;
  }

  private async accessCheck(ctx: ContextRepo, auth: ApiAuth, companyId: EntityId): Promise<void> {
    await this.authService.authFromCompanyUser(ctx, auth, companyId);
  }
}
