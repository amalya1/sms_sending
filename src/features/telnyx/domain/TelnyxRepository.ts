import { ContextRepo } from '../../../common/types/repository.types';
import { TelnyxCreateMessagesArgs, TelnyxMessageEntity } from './types';

export abstract class TelnyxRepository {
  abstract createMessages(
    ctx: ContextRepo,
    args: TelnyxCreateMessagesArgs,
  ): Promise<TelnyxMessageEntity[]>

  abstract updateMessagesStatus(
    ctx: ContextRepo,
    externalId: string,
    phoneStatusList: { phone: string; status: string }[],
  ): Promise<void>
}
