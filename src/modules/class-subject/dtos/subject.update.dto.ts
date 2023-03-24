import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { GetCurrentDate } from 'src/utils/get.current-date';
import { ProcessSubjectDto } from './process.create.dto';

export class UpdateSubjectDto {
  @IsOptional()
  @IsString()
  @ApiProperty()
  course?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ default: 'KTLT' })
  name?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  degreeLevel?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  major?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  lecturer?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  semester?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @ApiProperty({ default: new GetCurrentDate().getYearMonthDate() })
  openTime?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @ApiProperty({ default: new GetCurrentDate().getYearMonthDate() })
  closeTime?: Date;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @ApiProperty({ default: 60 })
  size?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @ApiProperty({ default: 3 })
  numberCredits?: number;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ default: false })
  elective?: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ default: true })
  calculateCumulativePoint?: boolean;

  @IsOptional()
  @IsString()
  @ApiProperty({ default: 'Monday' })
  learnDate?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ default: '8-10h A.M' })
  time?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @ApiProperty({ default: new GetCurrentDate().getYearMonthDate() })
  startDate?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @ApiProperty({ default: new GetCurrentDate().getYearMonthDate() })
  endDate?: Date;

  @IsOptional()
  @IsObject()
  @ApiProperty({ type: ProcessSubjectDto })
  midTermTest?: ProcessSubjectDto;

  @IsOptional()
  @IsObject()
  @ApiProperty({ type: ProcessSubjectDto })
  finalExam?: ProcessSubjectDto;

  @IsOptional()
  @IsObject()
  @ApiProperty({ type: ProcessSubjectDto })
  studentEssay?: ProcessSubjectDto;
}
