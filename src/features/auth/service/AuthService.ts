import { ContextRepo } from '../../../common/types/repository.types';
import { Inject } from '@nestjs/common';
import { Config } from '../../../common/config/config';
import { UserEntity } from '../../users/domain/types';
import { CompanyUserRepository } from '../../companyUser/domain/CompanyUserRepository';
import { CompaniesRepository } from '../../companies/domain/CompaniesRepository';
import { ApiAuth, CompanyUserAuth } from '../auth.types';
import { EntityId } from '../../../common/types/entity.types';
import { UsersRepository } from '../../users/domain/UsersRepository';
import { errorAuth, errorUnauthorized } from '../../../common/errors/errors.types';
import { errorCompanyNotFound } from '../../companies/domain/errors';



export abstract class AuthService {
  abstract checkUserCompany(ctx: ContextRepo, user: UserEntity): Promise<boolean>

  abstract authFromUser(ctx: ContextRepo, userId: EntityId): Promise<ApiAuth>

  abstract authFromCompanyUser(ctx: ContextRepo, auth: ApiAuth, companyId: EntityId): Promise<CompanyUserAuth>
}


export class AuthServiceImpl implements AuthService {

  constructor(
    @Inject(Config) private readonly config: Config,
    @Inject(UsersRepository) protected readonly usersRepository: UsersRepository,
    @Inject(CompanyUserRepository) protected companyUserRepository: CompanyUserRepository,
    @Inject(CompaniesRepository) protected companiesRepository: CompaniesRepository,
  ) {
  }

  async checkUserCompany(ctx: ContextRepo, user: UserEntity): Promise<boolean> {
    const [companyIds] = await this.companyUserRepository.getCompanyIdsByUser(ctx, [user.id]);
    const activeCompany = (await this.companiesRepository.list(ctx, companyIds)).find(c => c != null && c.status == 'active');
    return activeCompany != null || user.type == 'admin';
  }

  async authFromUser(ctx: ContextRepo, userId: EntityId): Promise<ApiAuth> {
    const [user] = await this.usersRepository.list(ctx, [userId]);
    if (user == null || user.status != 'active' || !await this.checkUserCompany(ctx, user)) throw errorUnauthorized();
    return {
      type: user.type,
      userId: userId,
    };
  }

  async authFromCompanyUser(ctx: ContextRepo, auth: ApiAuth, companyId: EntityId): Promise<CompanyUserAuth> {
    const [company] = await this.companiesRepository.list(ctx, [companyId]);
    if (company == null || company.status != 'active') throw errorCompanyNotFound(companyId);

    if (auth.type == 'admin') {
      return {
        type: auth.type,
        userId: auth.userId,
        companyId: companyId,
        permissions: [],
      };
    }
    else if (auth.type == 'user') {
      const [companyUser] = await this.companyUserRepository.getByCompanyAndUser(ctx, companyId, [auth.userId]);
      if (companyUser == null) throw errorCompanyNotFound(companyId);

      return {
        type: auth.type,
        userId: auth.userId,
        companyId: companyId,
        permissions: companyUser.permissions,
      };
    }

    throw errorAuth(`Incorrect auth type: ${auth.type}. User type is required.`);
  }
}

