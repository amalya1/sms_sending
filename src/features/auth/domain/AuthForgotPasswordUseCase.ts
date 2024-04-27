import { Inject } from '@nestjs/common';
import { ContextRepo } from '../../../common/types/repository.types';
import { UsersRepository } from '../../users/domain/UsersRepository';
import { AuthForgotPasswordInput } from './types';
import { AuthService } from '../service/AuthService';
import { UsersService } from '../../users/service/UsersService';
import { Config } from '../../../common/config/config';
import { EmailService } from '../../email/service/EmailService';
import { ForgotPasswordEvent } from '../../email/service/types';
import { errorUserNotFound } from '../../users/domain/errors';


export class AuthForgotPasswordUseCase {
  constructor(
    @Inject(UsersRepository) protected usersRepository: UsersRepository,
    @Inject(AuthService) protected authService: AuthService,
    @Inject(UsersService) protected usersService: UsersService,
    @Inject(Config) private readonly config: Config,
    @Inject(EmailService) private readonly emailService: EmailService,
  ) {
  }


  async invoke(ctx: ContextRepo, input: AuthForgotPasswordInput): Promise<void> {
    const [user] = await this.usersRepository.listByEmail(ctx, [input.email]);
    if (user == null || user.status != 'active' || !await this.authService.checkUserCompany(ctx, user))
      throw errorUserNotFound(input.email);

    const resetPasswordToken = await this.usersService.generateUniqueInvitationCode(ctx);
    const resetPasswordTokenExpire = new Date(new Date().getTime() + this.config.security.resetPasswordTokenExpireHours * 3600000);

    await this.usersRepository.update(ctx, user.setResetToken(resetPasswordToken, resetPasswordTokenExpire, user.id));

    await this.emailService.send(new ForgotPasswordEvent({ userId: user.id }));
  }
}
