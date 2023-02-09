import { HttpStatus } from '@nestjs/common';

export class Response {
  constructor(res: any, data: any, statusCode: number, message: string) {
    res.status(HttpStatus.OK).json({
      statusCode,
      data,
      message,
    });
  }
}
