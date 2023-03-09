import { ApiProperty } from '@nestjs/swagger';

export class CreateScholarshipUser {
  @ApiProperty({ required: true })
  scholarship?: string;

  @ApiProperty({ required: true })
  user?: string;

  @ApiProperty({ required: true })
  accumalatedPoint?: number;

  @ApiProperty({ required: true })
  trainningPoint?: number;
}
