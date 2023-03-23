import { ApiPropertyOptional } from '@nestjs/swagger';
import { GetCurrentDate } from 'src/utils/get.current-date';

export class PoliCySchoolDto {
  @ApiPropertyOptional()
  name?: string;

  @ApiPropertyOptional({ default: new GetCurrentDate().getYearMonthDate() })
  effectiveDate?: Date;

  @ApiPropertyOptional()
  content?: string;

  @ApiPropertyOptional()
  attachment?: string;
}
