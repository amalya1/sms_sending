import { ContextRepo } from '../../../common/types/repository.types';
import { Inject } from '@nestjs/common';
import { ContactsRepository } from './ContactsRepository';
import { ApiAuth } from '../../auth/auth.types';
import { EntityId } from '../../../common/types/entity.types';
import { AuthService } from '../../auth/service/AuthService';
import { ContactEntity, ContactSearchInput } from './types';


export class ContactsSearchUseCase {
  constructor(
    @Inject(ContactsRepository) protected contactsRepository: ContactsRepository,
    @Inject(AuthService) protected authService: AuthService,
  ) {
  }


  async invoke(ctx: ContextRepo, auth: ApiAuth, input: ContactSearchInput): Promise<[ContactEntity[], number]> {
    const { companyId } = input;
    await this.accessCheck(ctx, auth, companyId);
    return await this.contactsRepository.search(ctx, {
      validStatus: input.validStatus,
      companies: [companyId],
      groups: input.groups,
      notInGroups: input.notInGroups,
      contacts: [],
      limit: input.limit,
      offset: input.offset,
    }); 
  }


  private async accessCheck(ctx: ContextRepo, auth: ApiAuth, companyId: EntityId): Promise<void> {
    await this.authService.authFromCompanyUser(ctx, auth, companyId);
  }
}
