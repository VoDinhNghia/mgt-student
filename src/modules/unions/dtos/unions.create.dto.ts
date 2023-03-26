import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { UnionImagesDto } from './unions.images.dto';
import { UnionMemberDto } from './unions.member.dto';

export class CreateUnionDto {
  @IsString()
  @ApiProperty()
  url: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  nameUnit: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  address: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  mobile: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  introduction: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  function: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UnionImagesDto)
  @ApiProperty({ type: [UnionImagesDto] })
  images: UnionImagesDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UnionMemberDto)
  @ApiProperty({ type: [UnionMemberDto] })
  members: UnionMemberDto[];
}
