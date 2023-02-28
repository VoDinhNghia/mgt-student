import { ApiProperty } from '@nestjs/swagger';

export class OutputCourseDto {
  @ApiProperty({ required: true, default: 400 })
  toeic?: string; // 400, 450, 500 ...

  @ApiProperty({ required: true, default: true })
  it?: boolean;

  @ApiProperty({ required: false })
  conditionDiff?: string; // GDTC, GDQP ...
}
