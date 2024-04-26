import { Inject } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { Config } from '../../../common/config/config';
import { TelnyxClient } from './TelnyxClient';
import { TelnyxMessageApi, TelnyxSendMessageInputApi } from './types';

export class TelnyxClientImpl implements TelnyxClient {

  private readonly axios: AxiosInstance;

  constructor(
    @Inject(Config) private readonly config: Config,
  ) {
    this.axios = axios.create({
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${this.config.telnyx.apiKey}`,
      },
    });
  }

  async sendMessage(message: TelnyxSendMessageInputApi): Promise<TelnyxMessageApi> {
    return this.axios.post(
      'https://api.telnyx.com/v2/messages',
      message,
    );
  }

}
