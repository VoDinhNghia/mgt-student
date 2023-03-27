import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { CountriesCommonDto } from './countries.create.common.dto';

export class CreateProvinceDto extends CountriesCommonDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  capital: string;
}
