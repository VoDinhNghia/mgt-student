import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { GetCurrentDate } from 'src/utils/get.current-date';
import { ContactSchoolDto } from './school.contact.dto';
import { LocationSchoolDto } from './school.location.dto';
import { PoliCySchoolDto } from './school.policy.dto';

export class CreateSchoolDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  schoolCode?: string;

  @IsNumber()
  @ApiProperty({ default: 40000 })
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

  @ApiProperty({
    required: true,
    default: new GetCurrentDate().getYearMonthDate(),
  })
  yearFound?: Date;

  @ApiPropertyOptional()
  generalInfo?: string;
}
