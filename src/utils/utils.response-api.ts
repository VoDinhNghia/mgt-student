import { HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { HttpStatusCode } from 'src/constants/constants.http-status';

export class ResponseRequest {
  constructor(
    res: Response,
    data: object | object[] | boolean | string | number,
    message: string,
  ) {
    res.status(HttpStatus.OK).json({
      statusCode: HttpStatusCode.OK,
      data,
      message,
    });
  }
}
