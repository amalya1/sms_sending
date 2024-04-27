import { ContextRepo } from '../../../common/types/repository.types';
import { ApiAuth } from '../../auth/auth.types';
import { Inject } from '@nestjs/common';
import { EntityId } from '../../../common/types/entity.types';
import { AuthService } from '../../auth/service/AuthService';
import { ContactsRepository } from './ContactsRepository';
import { errorContactNotFound } from './errors';


export class ContactsDeleteUseCase {
  constructor(
    @Inject(ContactsRepository) protected contactsRepository: ContactsRepository,
    @Inject(AuthService) protected authService: AuthService,
  ) {
  }


  async invoke(ctx: ContextRepo, auth: ApiAuth, contactId: EntityId, companyId: EntityId): Promise<void> {
    await this.accessCheck(ctx, auth, companyId);

    const [contact] = await this.contactsRepository.list(ctx, [contactId]);
    if (contact == null || contact.companyId != companyId || contact.status != 'active') throw errorContactNotFound(contactId);

    await this.contactsRepository.deleteSoft(ctx, { userId: auth.userId, contactIds: [contactId] });
  }


  private async accessCheck(ctx: ContextRepo, auth: ApiAuth, companyId: EntityId): Promise<void> {
    await this.authService.authFromCompanyUser(ctx, auth, companyId);
  }
}
