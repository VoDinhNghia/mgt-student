import { ApiProperty } from '@nestjs/swagger';

export class FacultyQueryDto {
  @ApiProperty({ required: false })
  searchKey?: string;

  @ApiProperty({ required: false })
  branch?: string;
}
