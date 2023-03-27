import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { CountriesCommonDto } from './countries.create.common.dto';

export class CreateDistrictDto extends CountriesCommonDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  provinceId: string;
}
