import { ApiProperty } from '@nestjs/swagger';
export class QueryPovinceDto {
  @ApiProperty({ required: false })
  countryId: string;

  @ApiProperty({ default: 10 })
  limit?: number;

  @ApiProperty({ default: 1 })
  page: number;
}
