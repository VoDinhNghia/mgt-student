import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class ProcessSubjectDto {
  @IsNumber()
  @ApiProperty({ default: 1 })
  week?: number;

  @IsNumber()
  @ApiProperty({ default: 60 })
  time?: number;

  @IsString()
  @ApiProperty({ default: 'LO1 LO2 ...' })
  output?: string;

  @IsNumber()
  @ApiProperty({ default: 30 })
  percent?: number;

  @ApiProperty({ required: true, default: '2023-03-01' })
  examDate?: Date;
}
