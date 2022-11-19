import { ApiProperty } from '@nestjs/swagger';
export class CountriesDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  flag?: string;

  @ApiProperty()
  countryId: string;

  @ApiProperty()
  capital: string;
}
