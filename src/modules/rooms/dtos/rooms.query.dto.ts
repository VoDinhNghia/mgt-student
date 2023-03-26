import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { QueryPagination } from 'src/utils/utils.page.query.pagination.dto';

export class QueryRoomDto extends QueryPagination {
  @IsOptional()
  @IsString()
  @ApiProperty()
  type?: string;
}
