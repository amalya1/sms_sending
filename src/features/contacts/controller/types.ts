import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { JSONValue, Optional } from '../../../common/types/entity.types';
import { ContactValidStatus, ContactValidStatusOptions } from '../contacts.types';
import { ApiPropertyOptionsList } from '../../../common/docs/api.docs';


export abstract class ContactsAddInputBody {
  @ApiProperty()
  abstract phoneNumber: string;
  @ApiProperty({ type: 'string', nullable: true })
  abstract email: Optional<string>;
  @ApiProperty({ type: 'string', nullable: true })
  abstract firstName: Optional<string>;
  @ApiProperty({ type: 'string', nullable: true })
  abstract lastName: Optional<string>;
  @ApiProperty({ type: 'string', format: 'date', nullable: true })
  abstract birthdate: Optional<Date>;
  @ApiProperty({ type: 'object', nullable: true })
  abstract contactMetadata: Optional<{ [x: string]: JSONValue }>;
  @ApiProperty({ type: 'string', nullable: true })
  abstract timeZone: Optional<string>;
}

export abstract class ContactUpdateInputBody {
  @ApiProperty()
  abstract phoneNumber: string;
  @ApiProperty({ type: 'string', nullable: true })
  abstract email: Optional<string>;
  @ApiProperty({ type: 'string', nullable: true })
  abstract firstName: Optional<string>;
  @ApiProperty({ type: 'string', nullable: true })
  abstract lastName: Optional<string>;
  @ApiProperty({ type: 'string', format: 'date', nullable: true })
  abstract birthdate: Optional<Date>;
  @ApiProperty({ type: 'object', nullable: true })
  abstract contactMetadata: Optional<{ [x: string]: JSONValue }>;
  @ApiProperty({ type: 'string', nullable: true })
  abstract timeZone: Optional<string>;
}

export abstract class ContactSearchInputQuery {
  @ApiPropertyOptional({ type: 'string', description: 'List of comma-separated values', example: ContactValidStatusOptions.join() })
  abstract validStatus: ContactValidStatus[];
  @ApiProperty({ type: 'string', format: 'uuid' })
  abstract companyId: string;
  @ApiPropertyOptional(ApiPropertyOptionsList({ required: false }))
  abstract groups: string[];
  @ApiPropertyOptional(ApiPropertyOptionsList({ required: false }))
  abstract notInGroups: string[];
  @ApiProperty()
  abstract limit: number;
  @ApiProperty()
  abstract offset: number;
}
