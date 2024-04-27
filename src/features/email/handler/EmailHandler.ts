import { CreateUserEventData, EmailEventType } from '../service/types';



export abstract class EmailHandler {

  abstract handle (data: CreateUserEventData): Promise<void>

  abstract canHandle(type: EmailEventType): boolean
}
