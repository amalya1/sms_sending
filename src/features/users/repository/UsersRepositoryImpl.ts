import { Inject } from '@nestjs/common';
import { EntityId, Optional, OptionalId } from '../../../common/types/entity.types';
import { ContextRepo } from '../../../common/types/repository.types';
import { requireNotNulls } from '../../../common/utils/utils.base';
import { UsersDatabase } from '../database/UsersDatabase';
import { errorUserNotFound } from '../domain/errors';
import { UserEntity } from '../domain/types';
import { UsersRepository } from '../domain/UsersRepository';
import { UserDbToEntityMapper, UserEntityToDbMapper } from './mappers';
import { UserAdd, UserGetForCompanyArg, UserSearchArg } from './types';


export class UsersRepositoryImpl implements UsersRepository {

  constructor(
    @Inject(UserDbToEntityMapper) private readonly userDbToEntityMapper: UserDbToEntityMapper,
    @Inject(UserEntityToDbMapper) private readonly userEntityToDbMapper: UserEntityToDbMapper,
    @Inject(UsersDatabase) private readonly usersDatabase: UsersDatabase,
  ) {

  }

  async list(ctx: ContextRepo, pks: OptionalId[]): Promise<Optional<UserEntity>[]> {
    const entitiesDb = await this.usersDatabase.list(ctx, pks);
    return entitiesDb
      .map(db => db != null ? this.userDbToEntityMapper.map(db) : null);
  }

  async listByEmail(ctx: ContextRepo, emails: string[]): Promise<Optional<UserEntity>[]> {
    const entityIds = await this.usersDatabase.listByEmail(ctx, emails);
    return await this.list(ctx, entityIds);
  }

  async listByCode(ctx: ContextRepo, codes: string[]): Promise<Optional<UserEntity>[]> {
    const entityIds = await this.usersDatabase.listByCode(ctx, codes);
    return await this.list(ctx, entityIds);
  }

  async add(ctx: ContextRepo, input: UserAdd): Promise<UserEntity> {
    const entityDb = await this.usersDatabase.add(ctx, {
      email: input.email,
      phone_number: input.phoneNumber,
      status: input.status,
      type: input.type,
      password: input.password,
      first_name: input.firstName,
      last_name: input.lastName,
      created_by: input.createdBy,
      updated_by: input.createdBy,
      reset_password_token: input.resetPasswordToken,
      reset_password_token_expire: input.resetPasswordTokenExpire,
      deleted_at: null,
    });
    return this.userDbToEntityMapper.map(entityDb);
  }

  async update(ctx: ContextRepo, user: UserEntity): Promise<UserEntity> {
    await this.usersDatabase.update(
      ctx,
      user.id,
      this.userEntityToDbMapper.map(user),
    );
    const [entity] = requireNotNulls(await this.list(ctx, [user.id]));
    return entity;
  }

  async search(ctx: ContextRepo, input: UserSearchArg): Promise<[UserEntity[], number]> {
    const [rows, count] = await this.usersDatabase.search(
      ctx,
      {
        type: input.type,
        roles: [],
        companies: input.companies,
        users: input.users,
        limit: input.limit,
        offset: input.offset,
        query: input.query,
      },
    );
    const entities = requireNotNulls(await this.list(ctx, rows));
    return [entities, count];
  }

  async get(ctx: ContextRepo, input: EntityId): Promise<UserEntity> {
    const [entity] = await this.list(ctx, [input]);
    if (entity == null) {
      throw errorUserNotFound(input);
    }
    return entity;
  }

  async getForCompany(ctx: ContextRepo, input: UserGetForCompanyArg): Promise<UserEntity> {
    const [rows, count] = await this.usersDatabase.search(
      ctx,
      {
        companies: [input.companyId],
        users: [input.userId],
        type: [],
        roles: [],
        limit: 1,
        offset: 0,
        query: null,
      },
    );
    if (count == 0) {
      throw errorUserNotFound(input.userId);
    }
    return await this.get(ctx, rows[0]);
  }

}
