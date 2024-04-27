import { ApiProperty } from '@nestjs/swagger';
import { Optional } from '../../../common/types/entity.types';
import { PermissionNameOptions } from '../../auth/auth.types';


export abstract class UserSimpleView {
  @ApiProperty()
  abstract id: string;
  @ApiProperty()
  abstract email: string;
  @ApiProperty({ type: 'string', nullable: true })
  abstract phoneNumber: Optional<string>;
  @ApiProperty()
  abstract firstName: string;
  @ApiProperty()
  abstract lastName: string;
}

export abstract class UsersPermissionsView {
  @ApiProperty({ isArray: true, type: 'string', enum: PermissionNameOptions })
  abstract permissions: PermissionName[];
}
