import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { of } from 'rxjs';
import { CreateSubjectDto } from 'src/modules/class-subject/dtos/subject.create.dto';
import { CommonException } from '../exceptions/execeptionError';

export class ValidatePercentPoint implements NestInterceptor {
  async intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest<Headers>();
    const { midTermTest, finalExam, studentEssay }: CreateSubjectDto =
      request['body'];
    const midPercent = midTermTest.percent || 0;
    const finalPercent = finalExam.percent || 0;
    const essayPercent = studentEssay.percent || 0;
    if (!midPercent || !finalPercent || !essayPercent) {
      return of([
        new CommonException(
          400,
          '[Format] - midTermTest, finalExam, studentEssay percent must provided.',
        ),
      ]);
    }
    const isMidtermPercent = midPercent <= 100 && midPercent >= 0;
    const isFinalPercent = finalPercent <= 100 && finalPercent >= 0;
    const isEssayPercent = essayPercent <= 100 && essayPercent >= 0;
    const total = midPercent + finalPercent + essayPercent;
    if (total > 100 || total < 100) {
      return of([
        new CommonException(
          400,
          '[Validate] - Total of midTermTest, finalExam, studentEssay percent must eqal 100.',
        ),
      ]);
    }
    if (isMidtermPercent && isFinalPercent && isEssayPercent) {
      return next.handle();
    }

    return of([
      new CommonException(
        400,
        '[Format] - midtermScore or finalScore or essaySCore must >= 0 and <= 100',
      ),
    ]);
  }
}
