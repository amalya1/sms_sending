import { Inject } from '@nestjs/common';
import { Config } from '../../../common/config/config';
import { errorValidation } from '../../../common/errors/errors.types';
import { ContextRepo } from '../../../common/types/repository.types';
import { TelnyxService } from '../service/TelnyxService';
import { TelnyxRepository } from './TelnyxRepository';
import { TelnyxWebhookInput } from './types';

export class TelnyxWebhookUseCase {

  constructor(
    @Inject(TelnyxService) private readonly service: TelnyxService,
    @Inject(Config) private readonly config: Config,
    @Inject(TelnyxRepository) private readonly repository: TelnyxRepository,
  ) {
  }

  async invoke(ctx: ContextRepo, input: TelnyxWebhookInput): Promise<void> {
    const isValid = this.service.isSignatureValid(
      input.raw,
      input.signature,
      input.timestamp,
      this.config.telnyx.publicKey,
    );
    if (!isValid) {
      throw errorValidation('Invalid signature');
    }
    const externalId = input.data.data.payload.id;
    const phoneStatusList = input.data.data.payload.to.map(to => {
      return {
        phone: to.phone_number,
        status: to.status,
      };
    });
    await this.repository.updateMessagesStatus(ctx, externalId, phoneStatusList);
  }
}
