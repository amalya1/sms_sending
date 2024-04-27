import { Body, Controller, Get, HttpCode, HttpStatus, Inject, Param, Post, Put, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { RequestContext } from '../../../common/context/RequestContext';
import { ApiPaginationSchema } from '../../../common/docs/api.docs';
import { EntityId, Pagination } from '../../../common/types/entity.types';
import { joiEntityId } from '../../../common/validation';
import { pipeValidate } from '../../../common/validation/validation.pipes';
import { ApiAuth } from '../../auth/auth.types';
import { UserAuth } from '../../auth/auth.user.decorator';
import { authUser } from '../../auth/auth.utils';
import { CompaniesSimpleViewer } from '../../companies/viewer/CompaniesSimpleViewer';
import { CompanySimpleView } from '../../companies/viewer/types';
import { UsersChangePasswordUseCase } from '../domain/UsersChangePasswordUseCase';
import { UsersChangeRoleUseCase } from '../domain/UsersChangeRoleUseCase';
import { UsersCompaniesGetUseCase } from '../domain/UsersCompaniesGetUseCase';
import { UsersGetMeUseCase } from '../domain/UsersGetMeUseCase';
import { UsersGetUseCase } from '../domain/UsersGetUseCase';
import { UsersInviteUseCase } from '../domain/UsersInviteUseCase';
import { UsersSearchUseCase } from '../domain/UsersSearchUseCase';
import { UsersUpdateUseCase } from '../domain/UsersUpdateUseCase';
import { UserSimpleView, UsersPermissionsView } from '../viewer/types';
import { UsersPermissionsViewer } from '../viewer/UsersPermissionsViewer';
import { UsersSimpleViewer } from '../viewer/UsersSimpleViewer';
import {
  CompanyFilterInputQuery,
  UserChangePasswordInputBody,
  UserChangeRoleInputBody,
  UserInviteInputBody,
  UserSearchInputQuery,
  UserUpdateInputBody,
} from './types';
import {
  companyFilterSchema,
  userChangePasswordSchema,
  userChangeRoleSchema,
  userInviteSchema,
  userSearchQuerySchema,
  userUpdateSchema,
} from './validation';


@ApiBearerAuth()
@ApiTags('users')
@ApiExtraModels(
  UserSimpleView,
  CompanySimpleView,
  UsersPermissionsView,
  UserInviteInputBody,
  CompanyFilterInputQuery,
  UserChangeRoleInputBody,
  UserSearchInputQuery,
  UserUpdateInputBody,
)
@Controller('users')


export class UsersController {

  constructor(
    @Inject(RequestContext) private readonly context: RequestContext,
    @Inject(UsersGetMeUseCase) private readonly getMeUseCase: UsersGetMeUseCase,
    @Inject(UsersInviteUseCase) private readonly inviteUseCase: UsersInviteUseCase,
    @Inject(UsersChangeRoleUseCase) private readonly changeRoleUseCase: UsersChangeRoleUseCase,
    @Inject(UsersChangePasswordUseCase) private readonly changePasswordUseCase: UsersChangePasswordUseCase,
    @Inject(UsersUpdateUseCase) private readonly updateUseCase: UsersUpdateUseCase,
    @Inject(UsersCompaniesGetUseCase) private readonly getUsersCompaniesUseCase: UsersCompaniesGetUseCase,
    @Inject(UsersSearchUseCase) private readonly searchUseCase: UsersSearchUseCase,
    @Inject(UsersGetUseCase) private readonly getUseCase: UsersGetUseCase,
    @Inject(UsersSimpleViewer) private readonly usersSimpleViewer: UsersSimpleViewer,
    @Inject(CompaniesSimpleViewer) private readonly companiesSimpleViewer: CompaniesSimpleViewer,
    @Inject(UsersPermissionsViewer) private readonly usersPermissionsViewer: UsersPermissionsViewer,
  ) {
  }


  @Post('/invite')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    schema: { $ref: getSchemaPath(UserSimpleView) },
  })
  @ApiOperation({ operationId: 'user-invite', description: 'Invite user' })
  async invite(
    @UserAuth() auth: ApiAuth,
    @Query(pipeValidate(companyFilterSchema)) query: CompanyFilterInputQuery,
    @Body(pipeValidate(userInviteSchema)) body: UserInviteInputBody,
  ): Promise<UserSimpleView> {
    const user = await this.inviteUseCase.invoke(this.context, authUser(auth), body, query.companyId);
    const [view] = await this.usersSimpleViewer.view(this.context, auth, [user]);
    return view;
  }

  @Get('/companies')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: CompanySimpleView, isArray: true })
  @ApiOperation({ operationId: 'user-companies-get', description: 'Get user companies' })
  async getCompanies(
    @UserAuth() auth: ApiAuth,
  ): Promise<CompanySimpleView[]> {
    const companies = await this.getUsersCompaniesUseCase.invoke(this.context, authUser(auth));
    return await this.companiesSimpleViewer.view(this.context, auth, companies);
  }


  @Get('/permissions')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    schema: { $ref: getSchemaPath(UsersPermissionsView) },
  })
  @ApiOperation({ operationId: 'user-permissions-get', description: 'Get user permissions' })
  async getPermissions(
    @UserAuth() auth: ApiAuth,
    @Query(pipeValidate(companyFilterSchema)) query: CompanyFilterInputQuery,
  ): Promise<UsersPermissionsView> {
    return await this.usersPermissionsViewer.view(this.context, authUser(auth), query.companyId);
  }


  @Get('/me')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ schema: { $ref: getSchemaPath(UserSimpleView) } })
  @ApiOperation({ operationId: 'user-get-me', description: 'Get me' })
  async getMe(
    @UserAuth() auth: ApiAuth,
  ): Promise<UserSimpleView> {
    const user = await this.getMeUseCase.invoke(this.context, authUser(auth));
    const [view] = await this.usersSimpleViewer.view(this.context, auth, [user]);
    return view;
  }

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse(ApiPaginationSchema(getSchemaPath(UserSimpleView)))
  @ApiOperation({ operationId: 'users-search', description: 'Search users' })
  async search(
    @UserAuth() auth: ApiAuth,
    @Query(pipeValidate(userSearchQuerySchema)) query: UserSearchInputQuery,
  ): Promise<Pagination<UserSimpleView>> {
    const [items, count] = await this.searchUseCase.invoke(this.context, auth, query);
    const view = await this.usersSimpleViewer.view(this.context, auth, items);
    return { count: count, items: view };
  }

  @Put('/:userId/role')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  @ApiOperation({ operationId: 'user-role-change', description: 'Change user role' })
  async changeRole(
    @UserAuth() auth: ApiAuth,
    @Param('userId', pipeValidate(joiEntityId(false))) userId: EntityId,
    @Query(pipeValidate(companyFilterSchema)) query: CompanyFilterInputQuery,
    @Body(pipeValidate(userChangeRoleSchema)) body: UserChangeRoleInputBody,
  ): Promise<void> {
    await this.changeRoleUseCase.invoke(
      this.context,
      authUser(auth),
      { userId: userId, roleId: body.roleId },
      query.companyId,
    );
  }

  @Put('/:userId/password')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  @ApiOperation({ operationId: 'user-password-change', description: 'Change user password' })
  async changePassword(
    @UserAuth() auth: ApiAuth,
    @Param('userId', pipeValidate(joiEntityId(false))) userId: EntityId,
    @Body(pipeValidate(userChangePasswordSchema)) body: UserChangePasswordInputBody,
  ): Promise<void> {
    await this.changePasswordUseCase.invoke(
      this.context,
      authUser(auth),
      { userId: userId, ...body },
    );
  }

  @Get('/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ schema: { $ref: getSchemaPath(UserSimpleView) } })
  @ApiOperation({ operationId: 'user-get', description: 'Get user' })
  async get(
    @UserAuth() auth: ApiAuth,
    @Param('userId', pipeValidate(joiEntityId(false))) userId: EntityId,
    @Query(pipeValidate(companyFilterSchema)) query: CompanyFilterInputQuery,
  ): Promise<UserSimpleView> {
    const user = await this.getUseCase.invoke(this.context, authUser(auth), userId, query.companyId);
    const [view] = await this.usersSimpleViewer.view(this.context, auth, [user]);
    return view;
  }


  @Put('/:userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  @ApiOperation({ operationId: 'user-update', description: 'Update user' })
  async update(
    @UserAuth() auth: ApiAuth,
    @Param('userId', pipeValidate(joiEntityId(false))) userId: EntityId,
    @Body(pipeValidate(userUpdateSchema)) body: UserUpdateInputBody,
  ): Promise<void> {
    await this.updateUseCase.invoke(
      this.context,
      authUser(auth),
      { userId: userId, ...body },
    );
  }

}
