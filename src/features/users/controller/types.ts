import { ApiProperty } from '@nestjs/swagger';
import { EntityId, Optional } from '../../../common/types/entity.types';
import { UserChangePasswordInput, UserChangeRoleInput, UserInviteInput, UserUpdateInput } from '../domain/types';


export abstract class UserInviteInputBody implements UserInviteInput {
  @ApiProperty()
  abstract email: string;
  @ApiProperty({ type: 'string', nullable: true })
  abstract phoneNumber: Optional<string>;
  @ApiProperty()
  abstract firstName: string;
  @ApiProperty()
  abstract lastName: string;
  @ApiProperty()
  abstract roleId: string;
}


export abstract class CompanyFilterInputQuery {
  @ApiProperty()
  abstract companyId: string;
}


export abstract class UserChangeRoleInputBody implements Omit<UserChangeRoleInput, 'userId'> {
  @ApiProperty()
  abstract roleId: string;
}


export abstract class UserChangePasswordInputBody implements Omit<UserChangePasswordInput, 'userId'> {
  @ApiProperty()
  abstract currentPassword: string;
  @ApiProperty()
  abstract password: string;
}


export abstract class UserUpdateInputBody implements Omit<UserUpdateInput, 'userId'> {
  @ApiProperty()
  abstract firstName: string;
  @ApiProperty()
  abstract lastName: string;
  @ApiProperty({ type: 'string', nullable: true })
  abstract phoneNumber: Optional<string>;
}

export abstract class UserSearchInputQuery {
  @ApiProperty()
  abstract companyId: string;
  @ApiProperty()
  abstract limit: number;
  @ApiProperty()
  abstract offset: number;
  @ApiProperty()
  abstract query: string;
  @ApiProperty({ required: false, type: 'string' })
  abstract roleId: Optional<EntityId>;
}
