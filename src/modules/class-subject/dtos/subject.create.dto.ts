import { ApiProperty } from '@nestjs/swagger';

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
}
