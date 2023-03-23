import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class TrainningTimeCourseDto {
  @IsNumber()
  @ApiProperty({ default: 7, description: '7 year' })
  maximum?: number;

  @IsNumber()
  @ApiProperty({ default: 3, description: '3 year' })
  minimum?: number;
}
