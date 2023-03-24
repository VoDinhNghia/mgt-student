import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class BranchLocationDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  province: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  district: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
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
