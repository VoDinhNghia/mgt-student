import { HttpStatus } from '@nestjs/common';

export class ResponseRequest {
  constructor(res: any, data: any, message: string) {
    res.status(HttpStatus.OK).json({
      statusCode: 200,
      data,
      message,
    });
  }
}
