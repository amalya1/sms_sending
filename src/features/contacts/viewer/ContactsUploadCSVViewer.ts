import { ContextRepo } from '../../../common/types/repository.types';
import { ApiAuth } from '../../auth/auth.types';
import { ContactsUploadCSVView } from './types';
import { ContactsUploadCSVOutput } from '../domain/types';


export class ContactsUploadCSVViewer {

  async view(ctx: ContextRepo, auth: ApiAuth, entities: ContactsUploadCSVOutput): Promise<ContactsUploadCSVView> {

    const existedContactsViews = entities.existedContacts.map(e => ({
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
    }));

    const createdContactsViews = entities.createdContacts.map(e => ({
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
    }));

    // // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // const invalidContactsViews = entities.invalidContacts.map(e => ({
    //   phoneNumber: e.phoneNumber,
    //   email: e.email,
    //   firstName: e.firstName,
    //   lastName: e.lastName,
    //   birthdate: e.birthdate,
    //   contactMetadata: e.contactMetadata,
    //   timeZone: e.timeZone,
    // }));

    return {
      createdContacts: createdContactsViews,
      existedContacts: existedContactsViews,
      invalidContacts: entities.invalidContacts,
      repeatedContacts: entities.repeatedContacts,
    };
  }
}
