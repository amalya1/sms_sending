import { ContextRepo } from '../../../common/types/repository.types';
import { AuthLoginInput, AuthToken } from './types';
import { Inject } from '@nestjs/common';
import { UsersRepository } from '../../users/domain/UsersRepository';
import { AuthService } from '../service/AuthService';
import { jwtSign } from '../auth.utils';
import { Config } from '../../../common/config/config';
import { AuthRepository } from './AuthRepository';
import { errorValidation } from '../../../common/errors/errors.types';
import { comparePassword } from '../../users/users.utils';


export class AuthLoginPasswordUseCase {
  constructor(
    @Inject(UsersRepository) protected usersRepository: UsersRepository,
    @Inject(AuthRepository) protected authRepository: AuthRepository,
    @Inject(AuthService) protected authService: AuthService,
    @Inject(Config) private readonly config: Config,
  ) {
  }

  async invoke(ctx: ContextRepo, input: AuthLoginInput): Promise<AuthToken>{
    const [user] = await this.usersRepository.listByEmail(ctx, [input.email]);

    if (user == null || user.status != 'active' || !await this.authService.checkUserCompany(ctx, user)) {
      throw errorValidation('Invalid email or password');
    }
    if (user.password == null || !await comparePassword(input.password, user.password)) {
      throw errorValidation('Invalid email or password');
    }

    const { accessToken, refreshToken } = jwtSign(this.config, { userId: user.id });
    await this.authRepository.addRefreshToken(ctx, { token: refreshToken, userId: user.id });

    return {
      user,
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }
}
