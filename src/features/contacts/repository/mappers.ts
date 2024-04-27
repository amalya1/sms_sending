import { ContactEntityDb, ContactEntityDbData } from '../database/types';
import { ContactEntity } from '../domain/types';

export class ContactDbToEntityMapper {
  map(entityDb: ContactEntityDb): ContactEntity {
    return new ContactEntity(
      entityDb.id,
      entityDb.status,
      entityDb.valid_status,
      entityDb.company_id,
      entityDb.phone_number,
      entityDb.email,
      entityDb.first_name,
      entityDb.last_name,
      entityDb.birthdate,
      entityDb.contact_metadata,
      entityDb.time_zone,
      entityDb.opt_in_type,
      entityDb.opt_in_date,
      entityDb.opt_out_type,
      entityDb.opt_out_date,
      entityDb.created_by,
      entityDb.updated_by,
      entityDb.created_at,
      entityDb.updated_at,
      entityDb.deleted_at,
    );
  }
}

export class ContactEntityToDbMapper {
  map(entity: ContactEntity): ContactEntityDbData {
    return {
      status: entity.status,
      valid_status: entity.validStatus,
      company_id: entity.companyId,
      phone_number: entity.phoneNumber,
      email: entity.email,
      first_name: entity.firstName,
      last_name: entity.lastName,
      birthdate: entity.birthdate,
      contact_metadata: entity.contactMetadata,
      time_zone: entity.timeZone,
      opt_in_type: entity.optInType,
      opt_in_date: entity.optInDate,
      opt_out_type: entity.optOutType,
      opt_out_date: entity.optOutDate,
      created_by: entity.createdBy,
      updated_by: entity.updatedBy,
      deleted_at: entity.deletedAt,
    }
  }
}
