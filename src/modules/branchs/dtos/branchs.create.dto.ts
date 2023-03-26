import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
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
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => BranchLocationDto)
  @Type(() => BranchLocationDto)
  @ApiProperty()
  location?: BranchLocationDto;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => BranchContactInfoDto)
  @ApiProperty({ type: [BranchContactInfoDto] })
  contactInfo?: [BranchContactInfoDto];
}
