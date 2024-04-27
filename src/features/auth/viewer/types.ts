import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { UserSimpleView } from '../../users/viewer/types';


export abstract class AuthTokenView {
  @ApiProperty()
  abstract accessToken: string;
  @ApiProperty()
  abstract refreshToken: string;
  @ApiProperty({ allOf: [{ $ref: getSchemaPath(UserSimpleView) }] })
  abstract user: UserSimpleView;
}
