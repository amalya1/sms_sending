import { ContextRepo } from '../../../common/types/repository.types';
import { Inject } from '@nestjs/common';
import { ContactsRepository } from './ContactsRepository';
import { ApiAuth } from '../../auth/auth.types';
import { EntityId } from '../../../common/types/entity.types';
import { AuthService } from '../../auth/service/AuthService';
import { ContactsUploadCSVService } from '../service/ContactsUploadCSVService';
import { Readable } from 'stream';
import { contactCSVSchema, contactsHeadersSchema } from '../controller/validation';
import { ContactEntity, ContactsAddInput, ContactsUploadCSVOutput } from './types';
import { errorValidation } from '../../../common/errors/errors.types';
import { GroupsRepository } from '../../groups/domain/GroupsRepository';
import { ContactGroupRepository } from '../../contactGroup/domain/ContactGroupRepository';


export class ContactsUploadCSVUseCase {
  constructor(
    @Inject(AuthService) protected authService: AuthService,
    @Inject(ContactsRepository) protected contactsRepository: ContactsRepository,
    @Inject(ContactsUploadCSVService) protected contactsUploadCsvService: ContactsUploadCSVService,
    @Inject(GroupsRepository) protected groupsRepository: GroupsRepository,
    @Inject(ContactGroupRepository) protected contactGroupRepository: ContactGroupRepository,
  ) {
  }

  async invoke(
    ctx: ContextRepo,
    auth: ApiAuth,
    file: Express.Multer.File,
    companyId: EntityId
  ): Promise<ContactsUploadCSVOutput> {
    await this.accessCheck(ctx, auth, companyId);
    
    const stream = Readable.from([file.buffer.toString()]);


    const { validContacts, repeatedContacts, invalidContacts } = await (async () => {
      let size = 0;
      const validContacts: ContactEntity[] = [];
      const repeatedContacts: ContactEntity[] = [];
      const invalidContacts: ContactEntity[] = [];

      function validateHeaders(headers: ContactsAddInput): void {
        const headersValidation = contactsHeadersSchema.validate(headers);
        if (headersValidation.error) throw errorValidation('Required headers are missing');
      }

      function processData(data: ContactEntity): void {
        size++;
        if (size > 5000) throw errorValidation('Size exceeds the limit of 5000');

        const dataValidation = contactCSVSchema.validate(data);

        if (dataValidation.error) {
          invalidContacts.push(data);
        } else if (validContacts.find(c => c.phoneNumber == data.phoneNumber)) {
          repeatedContacts.push(data);
        } else {
          validContacts.push(data);
        }
      }
      await this.contactsUploadCsvService.validate(ctx, stream, validateHeaders, processData);
      return { validContacts: validContacts, invalidContacts: invalidContacts, repeatedContacts: repeatedContacts };
    })();


    const existing = await this.contactsRepository.getByCompanyAndPhone(
      ctx, 
      companyId, 
      validContacts.map((c) => c.phoneNumber),
    );

    const { existingActiveContacts, existingDeletedContacts, nonExistingContacts } = (() => {
      const existingActiveContacts: ContactEntity[] = [];
      const existingDeletedContacts: ContactEntity[] = [];
      const nonExistingContacts: ContactEntity[] = [];

      existing.map((c, i) => {
        if (c == null) nonExistingContacts.push(validContacts[i]);
        else if (c.status == 'active') existingActiveContacts.push(c);
        else if (c.status == 'deleted') existingDeletedContacts.push(c)
      });
      return {
        existingActiveContacts: existingActiveContacts,
        existingDeletedContacts: existingDeletedContacts,
        nonExistingContacts: nonExistingContacts,
      };
    })();

    if (existingDeletedContacts.length != 0) {
      await this.contactsRepository.restore(ctx, { userId: auth.userId, contactIds: existingDeletedContacts.map((c) => c.id) });
    }

    
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

      const createdContacts = await this.contactsRepository.add(txCtx, nonExistingContacts.map(i => ({
        status: 'active',
        validStatus: 'valid',
        companyId: companyId,
        phoneNumber: i.phoneNumber,
        email: i.email || null,
        firstName: i.firstName || null,
        lastName: i.lastName || null,
        birthdate: i.birthdate || null,
        contactMetadata: null,
        timeZone: i.timeZone || null,
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


    return {
      existedContacts: existingActiveContacts,
      repeatedContacts: repeatedContacts,
      invalidContacts: invalidContacts,
      createdContacts: [...createdContacts, ...existingDeletedContacts],
    }
  }


  private async accessCheck(ctx: ContextRepo, auth: ApiAuth, companyId: EntityId): Promise<void> {
    await this.authService.authFromCompanyUser(ctx, auth, companyId);
  }
}

