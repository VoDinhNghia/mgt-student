import { ApiProperty } from '@nestjs/swagger';
import { typeNews } from 'src/commons/constants';
export class QueryNewDto {
  @ApiProperty({ default: 10 })
  limit?: number;

  @ApiProperty({ enum: typeNews })
  type?: string;

  @ApiProperty({ default: 1 })
  page?: number;
}
