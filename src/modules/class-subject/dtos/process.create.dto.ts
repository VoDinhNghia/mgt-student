import { ApiProperty } from '@nestjs/swagger';

export class ProcessSubjectDto {
  @ApiProperty({ required: true, default: 1 })
  week?: number;

  @ApiProperty({ required: true, default: 60 })
  time?: number;

  @ApiProperty({ required: true, default: 'LO1 LO2 ...' })
  output?: string;

  @ApiProperty({ required: true, default: 30 })
  percent?: number;

  @ApiProperty({ required: true, default: '2023-03-01' })
  examDate?: Date;
}
