import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEmail, IsOptional, IsString } from 'class-validator';
import { UnionImagesDto } from './unions.images.dto';
import { UnionMemberDto } from './unions.member.dto';

export class UpdateUnionDto {
  @IsOptional()
  @IsString()
  @ApiProperty()
  url: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  nameUnit: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  address: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  mobile: string;

  @IsOptional()
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  introduction: string;

  @ApiProperty()
  function: string;

  @IsOptional()
  @IsArray()
  @ApiProperty({ type: [UnionImagesDto] })
  images: UnionImagesDto[];

  @IsOptional()
  @IsArray()
  @ApiProperty({ type: [UnionMemberDto] })
  members: UnionMemberDto[];
}
