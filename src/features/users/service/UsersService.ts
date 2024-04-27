import { Inject } from '@nestjs/common';
import { ContextRepo } from '../../../common/types/repository.types';
import { UsersRepository } from '../domain/UsersRepository';
import { errorUnknown } from '../../../common/errors/errors.types';
import { randomInvitationCode } from '../users.utils';


export abstract class UsersService {
  abstract generateUniqueInvitationCode(ctx: ContextRepo): Promise<string>

}


export class UsersServiceImpl implements UsersService {

  constructor(
    @Inject(UsersRepository) protected usersRepository: UsersRepository,
  ) {
  }

  async generateUniqueInvitationCode(ctx: ContextRepo): Promise<string> {
    for (let tryNumber = 0; tryNumber < 10; tryNumber++) {
      const code = randomInvitationCode();
      const [user] = await this.usersRepository.listByCode(ctx, [code]);
      if (!user) {
        return code;
      }
    }
    throw errorUnknown('Can\'t generate unique invitation code');
  }
}
