import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class QueryPagination {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @ApiPropertyOptional({ default: 10, required: false })
  limit?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @ApiPropertyOptional({ default: 1 })
  page?: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  searchKey?: string;
}
