import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class QueryUserScholarshipDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  scholarship?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  user?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  semester?: string;
}
