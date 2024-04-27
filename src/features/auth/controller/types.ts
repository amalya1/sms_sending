import { ApiProperty } from '@nestjs/swagger';
import { AuthForgotPasswordInput, AuthLoginInput, AuthRefreshTokenInput, AuthSetPasswordInput } from '../domain/types';


export abstract class AuthLoginInputBody implements AuthLoginInput {
  @ApiProperty()
  abstract email: string;
  @ApiProperty()
  abstract password: string;
}

export abstract class AuthRefreshTokenInputBody implements AuthRefreshTokenInput {
  @ApiProperty()
  abstract token: string;
}

export abstract class AuthForgotPasswordInputBody implements AuthForgotPasswordInput {
  @ApiProperty({ type: 'string', required: true })
  abstract email: string;
}

export abstract class AuthSetPasswordInputBody implements AuthSetPasswordInput {
  @ApiProperty()
  abstract token: string;
  @ApiProperty()
  abstract password: string;
}
