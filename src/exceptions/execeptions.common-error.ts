import { HttpException } from '@nestjs/common';

export class CommonException {
  constructor(statusCode: number, message: string) {
    throw new HttpException({ statusCode, message }, statusCode);
  }
}
