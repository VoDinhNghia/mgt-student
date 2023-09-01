/* eslint-disable class-methods-use-this */
import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { of } from 'rxjs';
import { classMsg } from 'src/constants/constants.message.response';
import { CreateSubjectDto } from 'src/modules/class-subject/dtos/class-subject.create-subject.dto';
import { CommonException } from '../exceptions/execeptions.common-error';
import { HttpStatusCode } from 'src/constants/constants.http-status';

export class ValidatePercentPoint implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest<Headers>();
    const { midTermTest, finalExam, studentEssay }: CreateSubjectDto =
      request['body'];
    const midPercent = midTermTest.percent || 0;
    const finalPercent = finalExam.percent || 0;
    const essayPercent = studentEssay.percent || 0;
    const total = midPercent + finalPercent + essayPercent;
    if (total === 100) {
      return next.handle();
    }
    return of([
      new CommonException(
        HttpStatusCode.BAD_REQUEST,
        classMsg.validateTotalPercent,
      ),
    ]);
  }
}
