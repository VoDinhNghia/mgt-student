import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateClassDto {
  @IsOptional()
  @IsString()
  @ApiProperty()
  course?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ default: 'DHKHMT12A' })
  name?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  degreeLevel?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @ApiProperty({ default: 50 })
  classSize?: number;

  @IsOptional()
  @IsString()
  @ApiProperty()
  major?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  homeroomteacher?: string;
}
