import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsObject, IsOptional, IsString } from 'class-validator';
import { BranchUpdateContactInfoDto } from './branchs.update-contact-info.dto';
import { BranchUpdateLocationDto } from './branchs.update-location.dto';

export class BranchUpdateDto {
  @IsOptional()
  @IsString()
  @ApiProperty()
  title?: string;

  @IsOptional()
  @IsString()
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

  @IsOptional()
  @IsObject()
  @ApiProperty({ type: BranchUpdateLocationDto })
  location?: BranchUpdateLocationDto;

  @IsOptional()
  @IsArray()
  @ApiProperty({ type: [BranchUpdateContactInfoDto] })
  contactInfo?: [BranchUpdateContactInfoDto];
}
