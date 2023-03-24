import { CountriesDto } from './countries.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { GetCurrentDate } from 'src/utils/get.current-date';

export class UpdateCountriesDto extends CountriesDto {
  @IsOptional()
  @ApiProperty({ default: new GetCurrentDate().getYearMonthDate() })
  updatedAt: Date;
}
