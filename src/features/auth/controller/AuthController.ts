import { Body, Controller, Delete, HttpCode, HttpStatus, Inject, Post, Put } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  getSchemaPath
} from '@nestjs/swagger';
import { pipeValidate } from '../../../common/validation/validation.pipes';
import { Public } from '../auth.public.decorator';
import { AuthService } from '../service/AuthService';
import { ApiAuth } from '../auth.types';
import {
  AuthLoginInputBody,
  AuthSetPasswordInputBody,
  AuthRefreshTokenInputBody,
  AuthForgotPasswordInputBody
} from './types';
import { UserAuth } from '../auth.user.decorator';
import { AuthLoginPasswordUseCase } from '../domain/AuthLoginPasswordUseCase';
import { AuthTokenView } from '../viewer/types';
import {
  authForgotPasswordInputSchema,
  authLoginInputSchema,
  authRefreshTokenInputSchema,
  authSetPasswordInputSchema
} from './validation';
import { AuthTokenViewer } from '../viewer/AuthTokenViewer';
import { AuthRefreshTokenUseCase } from '../domain/AuthRefreshTokenUseCase';
import { AuthSetPasswordUseCase } from '../domain/AuthSetPasswordUseCase';
import { AuthLogoutUseCase } from '../domain/AuthLogoutUseCase';
import { authUser } from '../auth.utils';
import { RequestContext } from '../../../common/context/RequestContext';
import { AuthForgotPasswordUseCase } from '../domain/AuthForgotPasswordUseCase';

@ApiBearerAuth()
@ApiExtraModels(AuthTokenView, AuthLoginInputBody, AuthRefreshTokenInputBody, AuthForgotPasswordInputBody)
@ApiTags('auth')
@Controller('auth')
export class AuthController {

  constructor(
    @Inject(RequestContext) private readonly context: RequestContext,
    @Inject(AuthLoginPasswordUseCase) private readonly loginPasswordUseCase: AuthLoginPasswordUseCase,
    @Inject(AuthRefreshTokenUseCase) private readonly refreshTokenUseCase: AuthRefreshTokenUseCase,
    @Inject(AuthForgotPasswordUseCase) private readonly forgotPasswordUseCase: AuthForgotPasswordUseCase,
    @Inject(AuthSetPasswordUseCase) private readonly setPasswordUseCase: AuthSetPasswordUseCase,
    @Inject(AuthLogoutUseCase) private readonly logoutUseCase: AuthLogoutUseCase,
    @Inject(AuthTokenViewer) protected readonly authTokenViewer: AuthTokenViewer,
    @Inject(AuthService) protected readonly authService: AuthService,
  ) {
  }

  @Post('/token')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    schema: { $ref: getSchemaPath(AuthTokenView) },
  })
  @ApiOperation({ operationId: 'login-password', description: 'Login with password.' })
  @Public()
  async token(
    @Body(pipeValidate(authLoginInputSchema)) body: AuthLoginInputBody,
  ): Promise<AuthTokenView>{
    const authToken = await this.loginPasswordUseCase.invoke(this.context, body);
    const auth = await this.authService.authFromUser(this.context, authToken.user.id);
    return await this.authTokenViewer.view(this.context, auth, authToken);
  }

  @Post('/refresh-token')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    schema: { $ref: getSchemaPath(AuthTokenView) },
  })
  @ApiOperation({ operationId: 'refresh-token', description: 'Get new tokens.' })
  @Public()
  async refreshToken(
    @Body(pipeValidate(authRefreshTokenInputSchema)) body: AuthRefreshTokenInputBody,
  ): Promise<AuthTokenView>{
    const authToken = await this.refreshTokenUseCase.invoke(this.context, body);
    const auth = await this.authService.authFromUser(this.context, authToken.user.id);
    return await this.authTokenViewer.view(this.context, auth, authToken);
  }

  @Post('/forgot-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  @ApiOperation({ operationId: 'forgot-password', description: 'Forgot password.' })
  @Public()
  async forgotPassword(
    @Body(pipeValidate(authForgotPasswordInputSchema)) body: AuthForgotPasswordInputBody,
  ): Promise<void> {
    await this.forgotPasswordUseCase.invoke(this.context, body);
  }

  @Put('/set-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  @ApiOperation({ operationId: 'set-password', description: 'Set password.' })
  @Public()
  async setPassword(
    @Body(pipeValidate(authSetPasswordInputSchema)) body: AuthSetPasswordInputBody,
  ): Promise<void> {
    await this.setPasswordUseCase.invoke(this.context, body);
  }

  @Delete('/logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  async logout(
    @UserAuth() auth: ApiAuth,
    @Body(pipeValidate(authRefreshTokenInputSchema)) body: AuthRefreshTokenInputBody,
  ): Promise<void> {
    await this.logoutUseCase.invoke(this.context, authUser(auth), body);
  }
}

