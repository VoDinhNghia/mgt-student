import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
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
  @Type(() => Number)
  @Min(0)
  @Max(500000)
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
  @ValidateNested()
  @Type(() => LocationSchoolDto)
  @ApiProperty()
  location?: LocationSchoolDto;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => LocationSchoolDto)
  @ApiProperty({ type: ContactSchoolDto })
  contactInfo?: ContactSchoolDto;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PoliCySchoolDto)
  @ApiProperty({ type: [PoliCySchoolDto] })
  policy?: PoliCySchoolDto[];

  @ApiProperty({
    required: true,
    default: new GetCurrentDate().getYearMonthDate(),
  })
  yearFound?: Date;

  @IsOptional()
  @IsString()
  @ApiProperty()
  generalInfo?: string;
}
