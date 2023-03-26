import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateClassDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  course?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: 'DHKHMT12A' })
  name?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  degreeLevel?: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(500)
  @Type(() => Number)
  @ApiProperty({ default: 50 })
  classSize?: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  major?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  homeroomteacher?: string;
}
