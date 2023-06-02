import { SetMetadata } from '@nestjs/common';

export interface ResponseMessageOptions {
  okMessage: string;
  emptyArrayMessage?: string;
}

export const ResponseMessageKey = 'RESPONSE_MESSAGE_KEY';
export const ResponseMessage = (options: ResponseMessageOptions) =>
  SetMetadata(ResponseMessageKey, options);
