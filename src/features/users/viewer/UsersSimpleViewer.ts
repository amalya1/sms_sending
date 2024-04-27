import { Inject } from '@nestjs/common';
import { Config } from '../../../common/config/config';
import { ContextRepo } from '../../../common/types/repository.types';
import { UserEntity } from '../domain/types';
import { UserSimpleView } from './types';
import { ApiAuth } from '../../auth/auth.types';


export class UsersSimpleViewer {

  constructor(
    @Inject(Config) private readonly config: Config,
  ) {
  }

  async view(ctx: ContextRepo, auth: ApiAuth, entities: UserEntity[]): Promise<UserSimpleView[]> {
    return entities.map(e => {
      return {
        id: e.id,
        email: e.email,
        phoneNumber: e.phoneNumber,
        firstName: e.firstName,
        lastName: e.lastName,
      };
    });
  }
}
