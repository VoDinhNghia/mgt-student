import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsString, Max, Min } from 'class-validator';

export class ProcessSubjectDto {
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @Max(20)
  @ApiProperty({ default: 1 })
  week?: number;

  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @Max(300)
  @ApiProperty({ default: 60 })
  time?: number;

  @IsString()
  @ApiProperty({ default: 'LO1 LO2 ...' })
  output?: string;

  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @Max(100)
  @ApiProperty({ default: 30 })
  percent?: number;

  @IsDate()
  @Type(() => Date)
  @ApiProperty({ required: true, default: '2023-03-01' })
  examDate?: Date;
}
