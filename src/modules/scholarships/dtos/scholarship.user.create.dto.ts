import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

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
  @ApiProperty()
  accumalatedPoint?: number;

  @IsNumber()
  @Type(() => Number)
  @ApiProperty()
  trainningPoint?: number;
}
