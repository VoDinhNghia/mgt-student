import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsObject, IsString } from 'class-validator';
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

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional()
  website?: string;

  @IsObject()
  @ApiProperty({ type: BranchLocationDto })
  location?: BranchLocationDto;

  @IsArray()
  @ApiProperty({ type: [BranchContactInfoDto] })
  contactInfo?: [BranchContactInfoDto];
}
