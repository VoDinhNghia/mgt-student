import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateScholarshipUser {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  scholarship?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  user?: string;

  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @Max(10)
  @ApiProperty()
  accumalatedPoint?: number;

  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @Max(100)
  @ApiProperty()
  trainningPoint?: number;
}
