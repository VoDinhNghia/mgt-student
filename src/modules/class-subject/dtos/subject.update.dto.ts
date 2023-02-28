import { ApiProperty } from '@nestjs/swagger';
import { ProcessSubjectDto } from './process.create.dto';

export class UpdateSubjectDto {
  @ApiProperty({ required: false })
  course?: string;

  @ApiProperty({ required: false, default: 'KTLT' })
  name?: string;

  @ApiProperty({ required: false })
  degreeLevel?: string;

  @ApiProperty({ required: false })
  major?: string;

  @ApiProperty({ required: false })
  lecturer?: string;

  @ApiProperty({ required: false })
  semester?: string;

  @ApiProperty({ required: false, default: '2023-02-27 ' })
  openTime?: string;

  @ApiProperty({ required: false, default: '2023-02-27' })
  closeTime?: Date;

  @ApiProperty({ required: false, default: 60 })
  size?: number;

  @ApiProperty({ required: false, default: 3 })
  numberCredits?: number; // 3 TC

  // create subject process
  @ApiProperty({ required: false, default: 'Monday' })
  learnDate?: string;

  @ApiProperty({ required: false, default: '8-10h A.M' })
  time?: string; // 8h - 10h A.M

  @ApiProperty({ required: false, default: '2023-02-28' })
  startDate?: Date;

  @ApiProperty({ required: false, default: '2023-03-28' })
  endDate?: Date;

  @ApiProperty({ required: false, type: ProcessSubjectDto })
  midTermTest?: ProcessSubjectDto;

  @ApiProperty({ required: false, type: ProcessSubjectDto })
  finalExam?: ProcessSubjectDto;

  @ApiProperty({ required: false, type: ProcessSubjectDto })
  studentEssay?: ProcessSubjectDto;
}
