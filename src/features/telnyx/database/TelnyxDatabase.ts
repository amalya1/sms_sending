import { EntityId, Optional } from '../../../common/types/entity.types';
import { ContextRepo } from '../../../common/types/repository.types';
import { TelnyxAddDbArgs, TelnyxMessageDb } from './types';

export abstract class TelnyxDatabase {
  abstract list(ctx: ContextRepo, args: Optional<EntityId>[]): Promise<Optional<TelnyxMessageDb>[]>

  abstract add(ctx: ContextRepo, args: TelnyxAddDbArgs): Promise<TelnyxMessageDb[]>

  abstract updateStatus(ctx: ContextRepo, externalId: string, args: { phone: string, status: string }[]): Promise<void>
}
