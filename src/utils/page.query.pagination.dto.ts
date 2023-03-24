import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class QueryPagination {
  @IsOptional()
  @IsNumber()
  @ApiProperty({ default: 10 })
  limit?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ default: 1 })
  page?: number;

  @IsOptional()
  @IsString()
  @ApiProperty()
  searchKey?: string;
}
