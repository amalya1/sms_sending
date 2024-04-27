import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { UserAuth } from '../../auth/auth.user.decorator';
import { ApiAuth } from '../../auth/auth.types';
import { ContactsSimpleViewer } from '../viewer/ContactsSimpleViewer';
import { ContactsUploadCSVView, ContactSimpleView } from '../viewer/types';
import { ContactsSearchUseCase } from '../domain/ContactsSearchUseCase';
import { ContactsAddUseCase } from '../domain/ContactsAddUseCase';
import { authUser } from '../../auth/auth.utils';
import { pipeValidate } from '../../../common/validation/validation.pipes';
import { companyFilterSchema } from '../../users/controller/validation';
import { CompanyFilterInputQuery } from '../../users/controller/types';
import { contactsAddSchemaArray, contactSearchQuerySchema, contactUpdateBodySchema } from './validation';
import { ContactsAddInputBody, ContactSearchInputQuery, ContactUpdateInputBody } from './types';
import { joiEntityId } from '../../../common/validation';
import { EntityId, Pagination } from '../../../common/types/entity.types';
import { ContactsUpdateUseCase } from '../domain/ContactsUpdateUseCase';
import { ApiPaginationSchema } from '../../../common/docs/api.docs';
import { ContactsGetUseCase } from '../domain/ContactsGetUseCase';
import { ContactsDeleteUseCase } from '../domain/ContactsDeleteUseCase';
import { FileInterceptor } from '@nestjs/platform-express';
import { ContactsUploadCSVUseCase } from '../domain/ContactsUploadCSVUseCase';
import { ContactsUploadCSVViewer } from '../viewer/ContactsUploadCSVViewer';
import { errorValidation } from '../../../common/errors/errors.types';
import { RequestContext } from '../../../common/context/RequestContext';


@ApiBearerAuth()
@ApiTags('contacts')
@ApiExtraModels(
  ContactSimpleView,
  CompanyFilterInputQuery,
  ContactUpdateInputBody,
  ContactsAddInputBody,
  ContactSearchInputQuery,
  ContactsUploadCSVView,
)
@Controller('contacts')
export class ContactsController {

  constructor(
    @Inject(RequestContext) private readonly context: RequestContext,
    @Inject(ContactsGetUseCase) private readonly getUseCase: ContactsGetUseCase,
    @Inject(ContactsDeleteUseCase) private readonly deleteUseCase: ContactsDeleteUseCase,
    @Inject(ContactsUpdateUseCase) private readonly updateUseCase: ContactsUpdateUseCase,
    @Inject(ContactsUploadCSVUseCase) private readonly contactsUploadCSVUseCase: ContactsUploadCSVUseCase,
    @Inject(ContactsAddUseCase) private readonly addUseCase: ContactsAddUseCase,
    @Inject(ContactsSearchUseCase) private readonly searchUseCase: ContactsSearchUseCase,
    @Inject(ContactsSimpleViewer) private readonly contactsSimpleViewer: ContactsSimpleViewer,
    @Inject(ContactsUploadCSVViewer) private readonly contactsUploadCsvViewer: ContactsUploadCSVViewer,
  ) {
  }


  @Post('/csv-upload')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: ContactsUploadCSVView, isArray: true })
  @ApiOperation({ operationId: 'contacts-csv-upload', description: 'Upload contacts CSV.' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' } } } })
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: (req, file, callback) => {
      if (!file.originalname.match(/\.(csv)$/))
        return callback(errorValidation('Only CSV files are allowed!'), false);
      callback(null, true);
    },
  }))
  async uploadCSV(
    @UploadedFile() file: Express.Multer.File,
    @UserAuth() auth: ApiAuth,
    @Query(pipeValidate(companyFilterSchema)) query: CompanyFilterInputQuery,
  ): Promise<ContactsUploadCSVView> {
    if (!file) throw errorValidation('File is required!');
    const items = await this.contactsUploadCSVUseCase.invoke(this.context, authUser(auth), file, query.companyId);
    return await this.contactsUploadCsvViewer.view(this.context, auth, items);
  }

  @Get('/:contactId')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ schema: { $ref: getSchemaPath(ContactSimpleView) } })
  @ApiOperation({ operationId: 'contact-get', description: 'Get contact' })
  async get(
    @UserAuth() auth: ApiAuth,
    @Param('contactId', pipeValidate(joiEntityId(false))) contactId: EntityId,
    @Query(pipeValidate(companyFilterSchema)) query: CompanyFilterInputQuery,
  ): Promise<ContactSimpleView> {
    const contact = await this.getUseCase.invoke(this.context, authUser(auth), contactId, query.companyId);
    const [view] = await this.contactsSimpleViewer.view(this.context, auth, [contact]);
    return view;
  }
  
  
  @Delete('/:contactId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  @ApiOperation({ operationId: 'contact-delete', description: 'Delete contact' })
  async delete(
    @UserAuth() auth: ApiAuth,
    @Param('contactId', pipeValidate(joiEntityId(false))) contactId: EntityId,
    @Query(pipeValidate(companyFilterSchema)) query: CompanyFilterInputQuery,
  ): Promise<void> {
    await this.deleteUseCase.invoke(
      this.context,
      authUser(auth), contactId, query.companyId);
  }

  @Put('/:contactId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  @ApiOperation({ operationId: 'contact-update', description: 'Update contact' })
  async update(
    @UserAuth() auth: ApiAuth,
    @Param('contactId', pipeValidate(joiEntityId(false))) contactId: EntityId,
    @Query(pipeValidate(companyFilterSchema)) query: CompanyFilterInputQuery,
    @Body(pipeValidate(contactUpdateBodySchema)) body: ContactUpdateInputBody,
  ): Promise<void> {
    await this.updateUseCase.invoke(
      this.context,
      authUser(auth),
      { contactId: contactId, ...body },
      query.companyId,
    );
  }


  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ schema: { type: 'array', items: { $ref: getSchemaPath(ContactSimpleView) } } })
  @ApiBody({ isArray: true, type: ContactsAddInputBody })
  @ApiOperation({ operationId: 'contacts-add', description: 'Add contacts' })
  async add(
    @UserAuth() auth: ApiAuth,
    @Query(pipeValidate(companyFilterSchema)) query: CompanyFilterInputQuery,
    @Body(pipeValidate(contactsAddSchemaArray)) body: ContactsAddInputBody[],
  ): Promise<ContactSimpleView[]> {
    const items = await this.addUseCase.invoke(this.context, authUser(auth), body, query.companyId);
    return await this.contactsSimpleViewer.view(this.context, auth, items);
  }


  @Get('/')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse(ApiPaginationSchema(getSchemaPath(ContactSimpleView)))
  @ApiOperation({ operationId: 'contacts-search', description: 'Search contacts' })
  async search(
    @UserAuth() auth: ApiAuth,
    @Query(pipeValidate(contactSearchQuerySchema)) query: ContactSearchInputQuery,
  ): Promise<Pagination<ContactSimpleView>> {
    const [items, count] = await this.searchUseCase.invoke(this.context, authUser(auth), query);
    const view = await this.contactsSimpleViewer.view(this.context, auth, items);
    return { count: count, items: view };
  }
}
