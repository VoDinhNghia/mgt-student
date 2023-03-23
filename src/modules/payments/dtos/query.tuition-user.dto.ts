import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class QueryTuitionUser {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  semester: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  profile?: string;

  @ApiPropertyOptional()
  faculty?: string;
}
