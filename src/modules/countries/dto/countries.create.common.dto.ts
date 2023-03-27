import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CountriesCommonDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  code?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  countryId: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  phoneCode?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  codename?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  status?: string;
}
