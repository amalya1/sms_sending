import { ContextRepo } from '../../../common/types/repository.types';
import { AuthRefreshTokenInput, AuthToken } from './types';
import { Inject } from '@nestjs/common';
import { UsersRepository } from '../../users/domain/UsersRepository';
import { AuthService } from '../service/AuthService';
import { Config } from '../../../common/config/config';
import { errorValidation } from '../../../common/errors/errors.types';
import { AuthRepository } from './AuthRepository';
import { jwtSign, jwtVerify } from '../auth.utils';
import { errorUserNotFound } from '../../users/domain/errors';


export class AuthRefreshTokenUseCase {
  constructor(
    @Inject(UsersRepository) protected usersRepository: UsersRepository,
    @Inject(AuthService) protected authService: AuthService,
    @Inject(Config) private readonly config: Config,
    @Inject(AuthRepository) protected authRepository: AuthRepository,
  ) {
  }

  async invoke(ctx: ContextRepo, input: AuthRefreshTokenInput): Promise<AuthToken> {
    const { token } = input;

    const payload = await (async () => {
      try {
        return jwtVerify(this.config, token);
      }
      catch (err) {
        await this.authRepository.deleteRefreshToken(ctx, [token]);
        throw errorValidation('Invalid token');
      }
    })();

    if(payload == null) throw errorValidation('Invalid token');
    const { userId } = payload;

    const [user] = await this.usersRepository.list(ctx, [userId]);
    if (user == null || user.status != 'active' || !await this.authService.checkUserCompany(ctx, user)) {
      throw errorUserNotFound(userId);
    }

    const [existedToken] = await this.authRepository.listByRefreshToken(ctx, [token]);
    if (existedToken == null || existedToken.userId != userId) throw errorValidation('Invalid token');
    
    const { accessToken, refreshToken } = jwtSign(this.config, { userId });

    await ctx.sql.begin(async (txSql) => {
      const txCtx = { ...ctx, sql: txSql };

      await this.authRepository.deleteRefreshToken(txCtx, [token]);
      await this.authRepository.addRefreshToken(txCtx, { token: refreshToken, userId: userId });
    });


    return {
      user: user,
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }
}
