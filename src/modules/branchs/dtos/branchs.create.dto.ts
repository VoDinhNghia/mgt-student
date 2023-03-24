import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { BranchContactInfoDto } from './branchs.contact-info.dto';
import { BranchLocationDto } from './branchs.location.dto';

export class BranchCreateDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  title?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  description?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  website?: string;

  @IsObject()
  @ApiProperty({ type: BranchLocationDto })
  location?: BranchLocationDto;

  @IsArray()
  @ApiProperty({ type: [BranchContactInfoDto] })
  contactInfo?: [BranchContactInfoDto];
}
