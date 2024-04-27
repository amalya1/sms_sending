import { EntityId, Optional, OptionalId } from '../../../common/types/entity.types';
import { ContextRepo } from '../../../common/types/repository.types';
import { UserAdd, UserGetForCompanyArg, UserSearchArg } from '../repository/types';
import { UserEntity } from './types';

export abstract class UsersRepository {
  abstract list(ctx: ContextRepo, pks: OptionalId[]): Promise<Optional<UserEntity>[]>

  abstract listByEmail(ctx: ContextRepo, emails: string[]): Promise<Optional<UserEntity>[]>

  abstract add(ctx: ContextRepo, input: UserAdd): Promise<UserEntity>

  abstract update(ctx: ContextRepo, user: UserEntity): Promise<UserEntity>

  abstract listByCode(ctx: ContextRepo, codes: string[]): Promise<Optional<UserEntity>[]>

  abstract search(ctx: ContextRepo, input: UserSearchArg): Promise<[UserEntity[], number]>

  abstract getForCompany(ctx: ContextRepo, input: UserGetForCompanyArg): Promise<UserEntity>

  abstract get(ctx: ContextRepo, input: EntityId): Promise<UserEntity>

}
