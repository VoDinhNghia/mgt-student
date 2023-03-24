import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
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

  @IsString()
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
  @ApiProperty({ type: [UnionImagesDto] })
  images: UnionImagesDto[];

  @IsOptional()
  @IsArray()
  @ApiProperty({ type: [UnionMemberDto] })
  members: UnionMemberDto[];
}
