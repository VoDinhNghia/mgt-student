import { ApiProperty } from '@nestjs/swagger';
import { EtypeVolunteeProgram } from 'src/constants/constant';
import { OrganizingCommitteeDto } from './trainning-point.organizing-committee.dto';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateVolunteeProgramDto {
  @IsString()
  @IsOptional()
  @ApiProperty()
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
  @ApiProperty()
  startDate?: string;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  @ApiProperty()
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
