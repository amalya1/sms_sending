import { TelnyxMessageData, TelnyxSendMessageArgs } from '../domain/types';

export abstract class TelnyxService {
  abstract sendSms(args: TelnyxSendMessageArgs): Promise<TelnyxMessageData[]>

  abstract isSignatureValid(
    payload: unknown,
    signature: string,
    timestamp: number,
    publicKey: string,
  ): boolean
}
