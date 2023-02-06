import { ApiProperty } from '@nestjs/swagger';

export class BranchQueryDto {
  @ApiProperty({ required: false })
  searchKey: string;

  @ApiProperty({ default: 10 })
  limit: number;

  @ApiProperty({ default: 1 })
  page: number;
}
