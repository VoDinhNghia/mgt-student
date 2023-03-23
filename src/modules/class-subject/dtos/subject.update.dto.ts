import { ApiPropertyOptional } from '@nestjs/swagger';
import { GetCurrentDate } from 'src/utils/get.current-date';
import { ProcessSubjectDto } from './process.create.dto';

export class UpdateSubjectDto {
  @ApiPropertyOptional()
  course?: string;

  @ApiPropertyOptional({ default: 'KTLT' })
  name?: string;

  @ApiPropertyOptional()
  degreeLevel?: string;

  @ApiPropertyOptional()
  major?: string;

  @ApiPropertyOptional()
  lecturer?: string;

  @ApiPropertyOptional()
  semester?: string;

  @ApiPropertyOptional({ default: new GetCurrentDate().getYearMonthDate() })
  openTime?: Date;

  @ApiPropertyOptional({ default: new GetCurrentDate().getYearMonthDate() })
  closeTime?: Date;

  @ApiPropertyOptional({ default: 60 })
  size?: number;

  @ApiPropertyOptional({ default: 3 })
  numberCredits?: number;

  @ApiPropertyOptional({ default: false })
  elective?: boolean;

  @ApiPropertyOptional({ default: true })
  calculateCumulativePoint?: boolean;

  @ApiPropertyOptional({ default: 'Monday' })
  learnDate?: string;

  @ApiPropertyOptional({ default: '8-10h A.M' })
  time?: string;

  @ApiPropertyOptional({ default: new GetCurrentDate().getYearMonthDate() })
  startDate?: Date;

  @ApiPropertyOptional({ default: new GetCurrentDate().getYearMonthDate() })
  endDate?: Date;

  @ApiPropertyOptional({ type: ProcessSubjectDto })
  midTermTest?: ProcessSubjectDto;

  @ApiPropertyOptional({ type: ProcessSubjectDto })
  finalExam?: ProcessSubjectDto;

  @ApiPropertyOptional({ type: ProcessSubjectDto })
  studentEssay?: ProcessSubjectDto;
}
