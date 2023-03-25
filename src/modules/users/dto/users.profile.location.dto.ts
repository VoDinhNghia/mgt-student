import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class LocationProfileDto {
  @IsOptional()
  @IsString()
  @ApiProperty()
  province?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  country?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  state?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  permanentAddress?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  temporaryAddress?: string;
}
