import { TelnyxMessageApi, TelnyxSendMessageInputApi } from './types';

export abstract class TelnyxClient {
  abstract sendMessage(message: TelnyxSendMessageInputApi): Promise<TelnyxMessageApi>
}
