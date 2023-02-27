import { ApiProperty } from '@nestjs/swagger';

export class TrainningTimeCourseDto {
  @ApiProperty({ required: true, default: 7 })
  maximum?: number; // 7 year

  @ApiProperty({ required: true, default: 3 })
  minimum?: number; // 3 year
}
