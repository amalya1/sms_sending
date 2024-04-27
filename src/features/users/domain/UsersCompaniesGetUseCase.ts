import { ContextRepo } from '../../../common/types/repository.types';
import { ApiAuth } from '../../auth/auth.types';
import { Inject } from '@nestjs/common';
import { CompaniesRepository } from '../../companies/domain/CompaniesRepository';
import { CompanyUserRepository } from '../../companyUser/domain/CompanyUserRepository';
import { CompanyEntity } from '../../companies/domain/types';
import { filterNotNull } from '../../../common/utils/utils.base';


export class UsersCompaniesGetUseCase {
  constructor(
    @Inject(CompaniesRepository) protected companiesRepository: CompaniesRepository,
    @Inject(CompanyUserRepository) protected companyUserRepository: CompanyUserRepository,
  ) {
  }


  async invoke(ctx: ContextRepo, auth: ApiAuth): Promise<CompanyEntity[]> {
    if (auth.type == 'admin') {
      return await this.companiesRepository.getAll(ctx, 'active');
    }

    const [companyIds] = await this.companyUserRepository.getCompanyIdsByUser(ctx, [auth.userId]);
    const companies = filterNotNull(await this.companiesRepository.list(ctx, companyIds));

    return companies.filter(c => c.status == 'active');
  }
}
