import { ApiProperty } from '@nestjs/swagger';
import { ContactSchoolDto } from './school.contact.dto';
import { LocationSchoolDto } from './school.location.dto';
import { PoliCySchoolDto } from './school.policy.dto';

export class CreateSchoolDto {
  @ApiProperty({ required: true })
  name?: string;

  @ApiProperty({ required: true })
  schoolCode?: string;

  @ApiProperty({ required: true, default: 40000 })
  numberTotal?: number;

  @ApiProperty({ required: false, type: [String] })
  image?: string[];

  @ApiProperty({ required: false, type: [String] })
  award?: string[];

  @ApiProperty({ required: false, type: LocationSchoolDto })
  location?: LocationSchoolDto;

  @ApiProperty({ required: false, type: ContactSchoolDto })
  contactInfo?: ContactSchoolDto;

  @ApiProperty({ required: false, type: [PoliCySchoolDto] })
  policy?: PoliCySchoolDto[];

  @ApiProperty({ required: true, default: '2023-02-25' })
  yearFound?: string;

  @ApiProperty({ required: false })
  generalInfo?: string;
}
