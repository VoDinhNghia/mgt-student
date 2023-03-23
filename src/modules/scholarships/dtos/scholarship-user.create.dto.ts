import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty()
  accumalatedPoint?: number;

  @IsNumber()
  @ApiProperty()
  trainningPoint?: number;
}
