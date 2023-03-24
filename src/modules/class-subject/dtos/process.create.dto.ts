import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsString } from 'class-validator';

export class ProcessSubjectDto {
  @IsNumber()
  @Type(() => Number)
  @ApiProperty({ default: 1 })
  week?: number;

  @IsNumber()
  @Type(() => Number)
  @ApiProperty({ default: 60 })
  time?: number;

  @IsString()
  @ApiProperty({ default: 'LO1 LO2 ...' })
  output?: string;

  @IsNumber()
  @Type(() => Number)
  @ApiProperty({ default: 30 })
  percent?: number;

  @IsDate()
  @Type(() => Date)
  @ApiProperty({ required: true, default: '2023-03-01' })
  examDate?: Date;
}
