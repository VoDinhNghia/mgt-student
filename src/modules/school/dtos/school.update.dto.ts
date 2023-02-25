import { ApiProperty } from '@nestjs/swagger';
import { ContactSchoolDto } from './school.contact.dto';
import { LocationSchoolDto } from './school.location.dto';
import { PoliCySchoolDto } from './school.policy.dto';

export class UpdateSchoolDto {
  @ApiProperty({ required: false })
  name?: string;

  @ApiProperty({ required: false })
  schoolCode?: string;

  @ApiProperty({ required: false, default: 40000 })
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

  @ApiProperty({ required: false, default: '2023-02-25' })
  yearFound?: string;

  @ApiProperty({ required: false })
  generalInfo?: string;
}
