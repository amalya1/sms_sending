import { ApiProperty } from '@nestjs/swagger';
import {
  ContactSourceType,
  ContactSourceTypeOptions,
  ContactValidStatus,
  ContactValidStatusOptions,
} from '../contacts.types';
import { JSONValue } from '../../../common/types/entity.types';


export abstract class ContactSimpleView {
  @ApiProperty()
  abstract id: string;
  @ApiProperty({ type: 'string', enum: ContactValidStatusOptions })
  abstract validStatus: ContactValidStatus;
  @ApiProperty()
  abstract companyId: string;
  @ApiProperty()
  abstract phoneNumber: string;
  @ApiProperty({ type: 'string', nullable: true })
  abstract email: string | null;
  @ApiProperty({ type: 'string', nullable: true })
  abstract firstName: string | null;
  @ApiProperty({ type: 'string', nullable: true })
  abstract lastName: string | null;
  @ApiProperty({ type: 'string', format: 'date', nullable: true })
  abstract birthdate: Date | null;
  @ApiProperty({ type: 'object', nullable: true })
  abstract contactMetadata: { [x: string]: JSONValue } | null;
  @ApiProperty({ type: 'string', nullable: true })
  abstract timeZone: string | null;
  @ApiProperty({ type: 'string', enum: ContactSourceTypeOptions })
  abstract optInType: ContactSourceType;
  @ApiProperty({ type: 'string', format: 'date-time', nullable: true })
  abstract optInDate: Date;
  @ApiProperty({ type: 'string', enum: ContactSourceTypeOptions, nullable: true })
  abstract optOutType: ContactSourceType | null;
  @ApiProperty({ type: 'string', format: 'date-time', nullable: true })
  abstract optOutDate: Date | null;
}

export abstract class ContactsUploadCSVView {
  @ApiProperty({ isArray: true, type: ContactSimpleView })
  abstract createdContacts: ContactSimpleView[];
  @ApiProperty({ isArray: true, type: ContactSimpleView })
  abstract existedContacts: ContactSimpleView[];
  @ApiProperty({ isArray: true, type: 'unknown' })
  abstract invalidContacts: ContactSimpleView[];
  @ApiProperty({ isArray: true, type: 'unknown' })
  abstract repeatedContacts: ContactSimpleView[];
}
