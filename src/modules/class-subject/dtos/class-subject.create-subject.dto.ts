import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';
import { GetCurrentDate } from 'src/utils/utils.get.current-date';
import { ProcessSubjectDto } from './class-subject.create-process.dto';

export class CreateSubjectDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  course?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: 'KTLT' })
  name?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  degreeLevel?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  major?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  lecturer?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  semester?: string;

  @IsDate()
  @Type(() => Date)
  @ApiProperty({
    required: true,
    default: new GetCurrentDate().getYearMonthDate(),
  })
  openTime?: Date;

  @IsDate()
  @Type(() => Date)
  @ApiProperty({
    required: true,
    default: new GetCurrentDate().getYearMonthDate(),
  })
  closeTime?: Date;

  @IsNumber()
  @Type(() => Number)
  @ApiProperty({ default: 60 })
  size?: number;

  @IsNumber()
  @Type(() => Number)
  @ApiProperty({ default: 3, description: '3 TC' })
  numberCredits?: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: 'Monday', description: 'create subject process' })
  learnDate?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    default: '8-10h A.M',
    description: 'Learn time',
  })
  time?: string;

  @IsDate()
  @Type(() => Date)
  @ApiProperty({ default: new GetCurrentDate().getYearMonthDate() })
  startDate?: Date;

  @IsDate()
  @Type(() => Date)
  @ApiProperty({ default: new GetCurrentDate().getYearMonthDate() })
  endDate?: Date;

  @IsBoolean()
  @ApiProperty({ default: false })
  elective?: boolean;

  @IsBoolean()
  @ApiProperty({ default: true })
  calculateCumulativePoint?: boolean;

  @IsObject()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ProcessSubjectDto)
  @ApiProperty()
  midTermTest?: ProcessSubjectDto;

  @IsObject()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ProcessSubjectDto)
  @ApiProperty()
  finalExam?: ProcessSubjectDto;

  @IsObject()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ProcessSubjectDto)
  @ApiProperty()
  studentEssay?: ProcessSubjectDto;
}
