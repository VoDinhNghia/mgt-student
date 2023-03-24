import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class BranchUpdateLocationDto {
  @IsOptional()
  @IsString()
  @ApiProperty()
  province: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  district: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  ward: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  country: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  address: string;
}
