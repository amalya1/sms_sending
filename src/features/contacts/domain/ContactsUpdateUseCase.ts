import { ContextRepo } from '../../../common/types/repository.types';
import { ApiAuth } from '../../auth/auth.types';
import { Inject } from '@nestjs/common';
import { EntityId } from '../../../common/types/entity.types';
import { AuthService } from '../../auth/service/AuthService';
import { ContactsRepository } from './ContactsRepository';
import { ContactUpdateInput } from './types';
import { errorContactConflict, errorContactNotFound } from './errors';


export class ContactsUpdateUseCase {
  constructor(
    @Inject(ContactsRepository) protected contactsRepository: ContactsRepository,
    @Inject(AuthService) protected authService: AuthService,
  ) {
  }


  async invoke(ctx: ContextRepo, auth: ApiAuth, input: ContactUpdateInput, companyId: EntityId): Promise<void> {
    await this.accessCheck(ctx, auth, companyId);
    const { contactId } = input;

    const [existing] = await this.contactsRepository.getByCompanyAndPhone(ctx, companyId, [input.phoneNumber]);
    if (existing != null && existing.id != contactId) throw errorContactConflict(input.phoneNumber);

    const [contact] = await this.contactsRepository.list(ctx, [contactId]);
    if (contact == null || contact.companyId != companyId || contact.status != 'active') throw errorContactNotFound(contactId);

    await this.contactsRepository.update(ctx, contact.setContactData(
      input.phoneNumber,
      input.firstName,
      input.lastName,
      input.email,
      input.birthdate,
      input.contactMetadata,
      input.timeZone,
      auth.userId
    ));
  }


  private async accessCheck(ctx: ContextRepo, auth: ApiAuth, companyId: EntityId): Promise<void> {
    await this.authService.authFromCompanyUser(ctx, auth, companyId);
  }
}
