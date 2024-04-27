import { ContextRepo } from '../../../common/types/repository.types';
import { ApiAuth } from '../../auth/auth.types';
import { ContactEntity } from '../domain/types';
import { ContactSimpleView } from './types';


export class ContactsSimpleViewer {

  async view(ctx: ContextRepo, auth: ApiAuth, entities: ContactEntity[]): Promise<ContactSimpleView[]> {

    return entities.map(e => {
      return {
        id: e.id,
        validStatus: e.validStatus,
        companyId: e.companyId,
        phoneNumber: e.phoneNumber,
        email: e.email,
        firstName: e.firstName,
        lastName: e.lastName,
        birthdate: e.birthdate,
        contactMetadata: e.contactMetadata,
        timeZone: e.timeZone,
        optInType: e.optInType,
        optInDate: e.optInDate,
        optOutType: e.optOutType,
        optOutDate: e.optOutDate,
      };
    });
  }
}
