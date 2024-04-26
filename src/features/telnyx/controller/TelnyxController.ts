import { Body, Controller, HttpCode, Inject, Post, Req } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums/http-status.enum';
import { Request } from 'express';
import { RequestContext } from '../../../common/context/RequestContext';
import { errorValidation } from '../../../common/errors/errors.types';
import { Optional } from '../../../common/types/entity.types';
import { Public } from '../../auth/auth.public.decorator';
import { TelnyxWebhookApi } from '../api/types';
import { TelnyxWebhookUseCase } from '../domain/TelnyxWebhookUseCase';

@Controller({
  path: 'telnyx',
})
@Public()
export class TelnyxController {

  constructor(
    @Inject(RequestContext) private readonly context: RequestContext,
    @Inject(TelnyxWebhookUseCase) private readonly webhookUseCase: TelnyxWebhookUseCase,
  ) {
  }

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async webhook(
    @Body() body: TelnyxWebhookApi,
    @Req() request: Request,
  ): Promise<void> {
    const signature: Optional<string> = request.header('telnyx-signature-ed25519') || null;
    const timestamp: Optional<number> = parseInt(request.header('telnyx-timestamp') || '');
    if (signature == null) throw errorValidation('empty signature');
    if (timestamp == null) throw errorValidation('empty timestamp');
    await this.webhookUseCase.invoke(
      this.context,
      {
        data: body,
        raw: request.body,
        signature: signature,
        timestamp: timestamp,
      },
    );
  }

}
