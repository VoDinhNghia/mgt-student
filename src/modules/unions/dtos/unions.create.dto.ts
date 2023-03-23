import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
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

  @ApiPropertyOptional({ type: [UnionImagesDto] })
  images: UnionImagesDto[];

  @ApiPropertyOptional({ type: [UnionMemberDto] })
  members: UnionMemberDto[];
}
