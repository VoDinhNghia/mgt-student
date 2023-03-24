import { CountriesDto } from './countries.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsOptional } from 'class-validator';
import { GetCurrentDate } from 'src/utils/get.current-date';
import { Type } from 'class-transformer';

export class UpdateCountriesDto extends CountriesDto {
  @IsOptional()
  @IsDate()
  @Type(() => Number)
  @ApiProperty({ default: new GetCurrentDate().getYearMonthDate() })
  updatedAt: Date;
}
