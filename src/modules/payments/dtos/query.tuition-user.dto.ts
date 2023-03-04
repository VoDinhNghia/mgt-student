import { ApiProperty } from '@nestjs/swagger';

export class QueryTuitionUser {
  @ApiProperty({ required: true })
  semester: string;

  @ApiProperty({ required: true })
  userProcess?: string;

  @ApiProperty({ required: false })
  faculty?: string;
}
