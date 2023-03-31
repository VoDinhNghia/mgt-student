import { ApiProperty } from '@nestjs/swagger';
import { EtypeVolunteeProgram } from 'src/constants/constant';
import { OrganizingCommitteeDto } from './trainning-point.organizing-committee.dto';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { GetCurrentDate } from 'src/utils/utils.get.current-date';

export class CreateVolunteeProgramDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: false })
  faculty?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  semester?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: EtypeVolunteeProgram.FACULTY })
  type?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  title?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  description?: string;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  @ApiProperty({ default: new GetCurrentDate().getYearMonthDate() })
  startDate?: string;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  @ApiProperty({ default: new GetCurrentDate().getYearMonthDate() })
  endDate?: Date;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  location?: string;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  @Max(30)
  @Min(0)
  @ApiProperty({ default: 5 })
  point?: number;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  @Max(100)
  @Min(0)
  @ApiProperty({ default: 40 })
  numberMember?: number;

  @IsObject()
  @ValidateNested()
  @Type(() => OrganizingCommitteeDto)
  @IsNotEmpty()
  @ApiProperty({ type: OrganizingCommitteeDto })
  organizingCommittee?: OrganizingCommitteeDto;
}
