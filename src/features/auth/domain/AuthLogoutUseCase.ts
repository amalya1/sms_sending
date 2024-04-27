import { ContextRepo } from '../../../common/types/repository.types';
import { AuthRefreshTokenInput } from './types';
import { Inject } from '@nestjs/common';
import { errorValidation } from '../../../common/errors/errors.types';
import { AuthRepository } from './AuthRepository';
import { ApiAuth } from '../auth.types';


export class AuthLogoutUseCase {
  constructor(
    @Inject(AuthRepository) protected authRepository: AuthRepository,
  ) {
  }


  async invoke(ctx: ContextRepo, auth: ApiAuth, input: AuthRefreshTokenInput): Promise<void> {
    const { token } = input;

    const [refreshToken] = await this.authRepository.listByRefreshToken(ctx, [token]);
    if (refreshToken == null || refreshToken.userId != auth.userId) throw errorValidation('Invalid token');

    await this.authRepository.deleteRefreshToken(ctx, [token]);
  }
}
