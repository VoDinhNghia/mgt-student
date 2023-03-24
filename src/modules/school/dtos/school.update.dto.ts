import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { GetCurrentDate } from 'src/utils/get.current-date';
import { ContactSchoolDto } from './school.contact.dto';
import { LocationSchoolDto } from './school.location.dto';
import { PoliCySchoolDto } from './school.policy.dto';

export class UpdateSchoolDto {
  @IsOptional()
  @IsString()
  @ApiProperty()
  name?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  schoolCode?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @ApiProperty({ default: 40000 })
  numberTotal?: number;

  @IsOptional()
  @IsArray()
  @ApiProperty({ type: [String] })
  image?: string[];

  @IsOptional()
  @IsArray()
  @ApiProperty({ type: [String] })
  award?: string[];

  @IsOptional()
  @IsObject()
  @ApiProperty({ type: LocationSchoolDto })
  location?: LocationSchoolDto;

  @IsOptional()
  @IsObject()
  @ApiProperty({ type: ContactSchoolDto })
  contactInfo?: ContactSchoolDto;

  @IsOptional()
  @IsArray()
  @ApiProperty({ type: [PoliCySchoolDto] })
  policy?: PoliCySchoolDto[];

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @ApiProperty({
    default: new GetCurrentDate().getYearMonthDate(),
  })
  yearFound?: Date;

  @IsOptional()
  @IsString()
  @ApiProperty()
  generalInfo?: string;
}
