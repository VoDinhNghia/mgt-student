import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class TrainningTimeCourseDto {
  @IsNumber()
  @Type(() => Number)
  @ApiProperty({ default: 7, description: '7 year' })
  maximum?: number;

  @IsNumber()
  @Type(() => Number)
  @ApiProperty({ default: 3, description: '3 year' })
  minimum?: number;
}
