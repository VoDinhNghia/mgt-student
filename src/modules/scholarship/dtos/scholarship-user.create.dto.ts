import { ApiProperty } from '@nestjs/swagger';

export class CreateScholarshipUser {
  @ApiProperty({ required: true })
  scholarship?: string;

  @ApiProperty({ required: true })
  user?: string;

  @ApiProperty({ required: true })
  point?: number;

  @ApiProperty({ required: true })
  rewardMoney?: number;
}
