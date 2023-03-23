import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class BranchLocationDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  province: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  district: string;

  @ApiPropertyOptional()
  ward: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  country: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  address: string;
}
