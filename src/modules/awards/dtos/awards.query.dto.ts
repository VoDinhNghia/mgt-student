import { ApiProperty } from '@nestjs/swagger';
import { EtypeAward } from 'src/commons/constants';

export class QueryAwardDto {
  @ApiProperty({ required: false, default: 10 })
  limit?: number;

  @ApiProperty({ required: false, default: 1 })
  page?: number;

  @ApiProperty({ required: false })
  searchKey?: string;

  @ApiProperty({
    required: false,
    enum: EtypeAward,
    default: EtypeAward.UNIVERSITY,
  })
  type?: string;

  @ApiProperty({ required: false, default: '2023-12-01T00:00:01' })
  fromDate?: string;

  @ApiProperty({ required: false, default: '2023-12-01T23:59:59' })
  toDate?: string;
}
