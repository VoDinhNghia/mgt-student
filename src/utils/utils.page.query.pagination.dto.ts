import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class QueryPagination {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @Max(5000)
  @ApiPropertyOptional({ default: 10, required: false })
  limit?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1000)
  @Type(() => Number)
  @ApiPropertyOptional({ default: 1 })
  page?: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  searchKey?: string;
}
