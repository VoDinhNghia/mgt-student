import { ApiProperty } from '@nestjs/swagger';
import { ProcessSubjectDto } from './process.create.dto';

export class CreateSubjectDto {
  @ApiProperty({ required: true })
  course?: string;

  @ApiProperty({ required: true, default: 'KTLT' })
  name?: string;

  @ApiProperty({ required: true })
  degreeLevel?: string;

  @ApiProperty({ required: true })
  major?: string;

  @ApiProperty({ required: true })
  lecturer?: string;

  @ApiProperty({ required: true })
  semester?: string;

  @ApiProperty({ required: true, default: '2023-02-27 ' })
  openTime?: string;

  @ApiProperty({ required: true, default: '2023-02-27' })
  closeTime?: Date;

  @ApiProperty({ required: true, default: 60 })
  size?: number;

  @ApiProperty({ required: true, default: 3 })
  numberCredits?: number; // 3 TC

  // create subject process
  @ApiProperty({ required: true, default: 'Monday' })
  learnDate?: string;

  @ApiProperty({ required: true, default: '8-10h A.M' })
  time?: string; // 8h - 10h A.M

  @ApiProperty({ required: true, default: '2023-02-28' })
  startDate?: Date;

  @ApiProperty({ required: true, default: '2023-03-28' })
  endDate?: Date;

  @ApiProperty({ required: true, default: false })
  elective?: boolean;

  @ApiProperty({ required: true, default: true })
  calculateCumulativePoint?: boolean;

  @ApiProperty({ required: true, type: ProcessSubjectDto })
  midTermTest?: ProcessSubjectDto;

  @ApiProperty({ required: true, type: ProcessSubjectDto })
  finalExam?: ProcessSubjectDto;

  @ApiProperty({ required: true, type: ProcessSubjectDto })
  studentEssay?: ProcessSubjectDto;
}
