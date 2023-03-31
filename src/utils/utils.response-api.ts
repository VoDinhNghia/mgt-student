import { HttpStatus } from '@nestjs/common';
import { Response } from 'express';

export class ResponseRequest {
  constructor(
    res: Response,
    data: object | object[] | boolean | string | number,
    message: string,
  ) {
    res.status(HttpStatus.OK).json({
      statusCode: 200,
      data,
      message,
    });
  }
}
