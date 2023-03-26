import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, Max, Min } from 'class-validator';

export class TrainningTimeCourseDto {
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @Max(10)
  @ApiProperty({ default: 7, description: '7 year' })
  maximum?: number;

  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @Max(10)
  @ApiProperty({ default: 3, description: '3 year' })
  minimum?: number;
}
