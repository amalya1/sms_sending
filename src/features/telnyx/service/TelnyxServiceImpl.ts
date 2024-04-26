import { Inject } from '@nestjs/common';
import { sign as ncSign } from 'tweetnacl';
import { Config } from '../../../common/config/config';
import { TelnyxClient } from '../api/TelnyxClient';
import { TelnyxMessageData, TelnyxSendMessageArgs } from '../domain/types';
import { TelnyxService } from './TelnyxService';

export class TelnyxServiceImpl implements TelnyxService {

  constructor(
    @Inject(TelnyxClient) private readonly client: TelnyxClient,
    @Inject(Config) private readonly config: Config,
  ) {
  }

  async sendSms(args: TelnyxSendMessageArgs): Promise<TelnyxMessageData[]> {
    const message = await this.client.sendMessage({
      from: args.senderPhone,
      text: args.text,
      subject: '',
      type: 'SMS',
      webhook_url: this.config.telnyx.webhookUrl,
      to: args.receiversPhones,
    });
    return message.to.map(to => {
      return {
        externalId: message.id,
        receiverPhone: to.phone_number,
      };
    });
  }

  isSignatureValid(
    payload: unknown,
    signature: string,
    timestamp: number,
    publicKey: string,
  ): boolean {
    const body = Buffer.isBuffer(payload) ? payload.toString('utf8') : payload;
    const bodyBuffer = Buffer.from(`${timestamp}|${body}`, 'utf8');

    try {
      return ncSign.detached.verify(
        bodyBuffer,
        Buffer.from(signature, 'base64'),
        Buffer.from(publicKey, 'base64'),
      );
    } catch (err) {
      return false;
    }
  }

}
