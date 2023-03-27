import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { CountriesCommonDto } from './countries.create.common.dto';

export class CreateWardDto extends CountriesCommonDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  provinceId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  districtId: string;
}
