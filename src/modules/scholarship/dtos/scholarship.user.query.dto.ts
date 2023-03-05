import { ApiProperty } from '@nestjs/swagger';

export class QueryUserScholarshipDto {
  @ApiProperty({ required: false })
  scholarship?: string;

  @ApiProperty({ required: false })
  user?: string;

  @ApiProperty({ required: false })
  semester?: string;
}
