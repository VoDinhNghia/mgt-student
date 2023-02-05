import { ApiProperty } from '@nestjs/swagger';
export class QueryDistrictDto {
  @ApiProperty({ required: false })
  provinceId: string;

  @ApiProperty({ default: 10 })
  limit?: number;

  @ApiProperty({ default: 1 })
  page: number;
}
