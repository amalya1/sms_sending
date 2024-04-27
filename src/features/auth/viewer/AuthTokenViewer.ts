import { ContextRepo } from '../../../common/types/repository.types';
import { Config } from '../../../common/config/config';
import { Inject } from '@nestjs/common';
import { UsersSimpleViewer } from '../../users/viewer/UsersSimpleViewer';
import { AuthTokenView } from './types';
import { AuthRepository } from '../domain/AuthRepository';
import { ApiAuth } from '../auth.types';
import { AuthToken } from '../domain/types';


export class AuthTokenViewer {

  constructor(
    @Inject(Config) private readonly config: Config,
    @Inject(UsersSimpleViewer) protected readonly usersSimpleViewer: UsersSimpleViewer,
    @Inject(AuthRepository) protected authRepository: AuthRepository,
  ) {
  }


  async view(ctx: ContextRepo, auth: ApiAuth, authToken: AuthToken): Promise<AuthTokenView> {
    const [userView] = await this.usersSimpleViewer.view(ctx, auth, [authToken.user]);

    return {
      accessToken: authToken.accessToken,
      refreshToken: authToken.refreshToken,
      user: userView
    };
  }
}
