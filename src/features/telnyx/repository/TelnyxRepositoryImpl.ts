import { Inject } from '@nestjs/common';
import { ContextRepo } from '../../../common/types/repository.types';
import { TelnyxDatabase } from '../database/TelnyxDatabase';
import { TelnyxAddDbArgs, TelnyxMessageDb } from '../database/types';
import { TelnyxRepository } from '../domain/TelnyxRepository';
import { TelnyxCreateMessagesArgs, TelnyxMessageEntity } from '../domain/types';

export class TelnyxRepositoryImpl implements TelnyxRepository {

  constructor(
    @Inject(TelnyxDatabase) private readonly database: TelnyxDatabase,
  ) {
  }

  async createMessages(
    ctx: ContextRepo,
    args: TelnyxCreateMessagesArgs,
  ): Promise<TelnyxMessageEntity[]> {
    const dbArgs: TelnyxAddDbArgs = args.map(d => {
      return {
        external_id: d.externalId,
        phone_sender: d.senderPhone,
        phone_receiver: d.receiverPhone,
        meta: null,
      };
    });
    const rows = await this.database.add(ctx, dbArgs);
    return rows.map(mapFromDb);
  }

  async updateMessagesStatus(
    ctx: ContextRepo,
    externalId: string,
    phoneStatusList: {
      phone: string;
      status: string
    }[],
  ): Promise<void> {
    await this.database.updateStatus(ctx, externalId, phoneStatusList);
  }

}

function mapFromDb(row: TelnyxMessageDb): TelnyxMessageEntity {
  return {
    externalId: row.external_id,
    senderPhone: row.phone_sender,
    receiverPhone: row.phone_receiver,
    id: row.id,
  };
}
