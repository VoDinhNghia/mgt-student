import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
export class CountriesDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  flag?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  countryId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  capital: string;
}
