import { ApiProperty } from '@nestjs/swagger';

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
}
