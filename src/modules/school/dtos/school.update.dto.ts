import { ApiPropertyOptional } from '@nestjs/swagger';
import { GetCurrentDate } from 'src/utils/get.current-date';
import { ContactSchoolDto } from './school.contact.dto';
import { LocationSchoolDto } from './school.location.dto';
import { PoliCySchoolDto } from './school.policy.dto';

export class UpdateSchoolDto {
  @ApiPropertyOptional()
  name?: string;

  @ApiPropertyOptional()
  schoolCode?: string;

  @ApiPropertyOptional({ default: 40000 })
  numberTotal?: number;

  @ApiPropertyOptional({ type: [String] })
  image?: string[];

  @ApiPropertyOptional({ type: [String] })
  award?: string[];

  @ApiPropertyOptional({ type: LocationSchoolDto })
  location?: LocationSchoolDto;

  @ApiPropertyOptional({ type: ContactSchoolDto })
  contactInfo?: ContactSchoolDto;

  @ApiPropertyOptional({ type: [PoliCySchoolDto] })
  policy?: PoliCySchoolDto[];

  @ApiPropertyOptional({
    default: new GetCurrentDate().getYearMonthDate(),
  })
  yearFound?: Date;

  @ApiPropertyOptional()
  generalInfo?: string;
}
