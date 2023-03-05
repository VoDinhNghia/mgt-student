import { ApiProperty } from '@nestjs/swagger';

export class QueryTuitionUser {
  @ApiProperty({ required: true })
  semester: string;

  @ApiProperty({ required: true })
  profile?: string;

  @ApiProperty({ required: false })
  faculty?: string;
}
