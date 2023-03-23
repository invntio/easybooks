import { SetMetadata } from '@nestjs/common';

export const ResponseMessageKey = 'RESPONSE_MESSAGE_KEY';
export const ResponseMessage = (message: string) =>
  SetMetadata(ResponseMessageKey, message);
