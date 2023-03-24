import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class QueryUserScholarshipDto {
  @IsOptional()
  @IsString()
  @ApiProperty()
  scholarship?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  user?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  semester?: string;
}
