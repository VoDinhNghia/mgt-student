import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { GetCurrentDate } from 'src/utils/get.current-date';

export class PoliCySchoolDto {
  @IsOptional()
  @IsString()
  @ApiProperty()
  name?: string;

  @IsOptional()
  @ApiProperty({ default: new GetCurrentDate().getYearMonthDate() })
  effectiveDate?: Date;

  @IsOptional()
  @IsString()
  @ApiProperty()
  content?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  attachment?: string;
}
