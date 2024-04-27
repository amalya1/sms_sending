import parse from 'csv-parser';
import { ContextRepo } from '../../../common/types/repository.types';
import { ContactEntity, ContactsAddInput } from '../domain/types';
import { errorUnknown } from '../../../common/errors/errors.types';


export abstract class ContactsUploadCSVService {
  abstract validate(
    ctx: ContextRepo, 
    stream: NodeJS.ReadableStream, 
    validateHeaders: (headers: ContactsAddInput) => void,
    processData: (data: ContactEntity) => void,
  ): Promise<void>
}


export class ContactsUploadCSVServiceImpl implements ContactsUploadCSVService {


  async validate(
    ctx: ContextRepo, 
    stream: NodeJS.ReadableStream, 
    validateHeaders: (headers: ContactsAddInput) => void,
    processData: (data: ContactEntity) => void,
  ): Promise<void> {

    const csvStream = stream.pipe(parse());

    return await new Promise<void>((resolve, reject) => {
      csvStream
        .on('headers', (headers: ContactsAddInput) => {
          try {
            validateHeaders(headers);
          } catch (error) {
            console.error('Error validating headers:', error);
            reject(error);
            csvStream.destroy();
          }
        })
        .on('data', (data: ContactEntity) => {
          try {
            processData(data);
          } catch (error) {
            console.error('Error process array:', error);
            reject(error);
            csvStream.destroy();
          }
        })
        .on('error', (error) => {
          console.error('Error occurred while parsing CSV:', error.message);

          reject(errorUnknown(`CSV Parsing Error: ${error.message}`));
          csvStream.destroy();
        })
        .on('end', () => {
          resolve();
          csvStream.destroy();
        });
    }).catch((error) => {
      throw error;
    });
  }
}
