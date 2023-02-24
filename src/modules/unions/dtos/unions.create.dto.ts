import { ApiProperty } from '@nestjs/swagger';
import { UnionImagesDto } from './unions.images.dto';
import { UnionMemberDto } from './unions.member.dto';

export class CreateUnionDto {
  @ApiProperty({ required: true })
  url: string;

  @ApiProperty({ required: true })
  nameUnit: string;

  @ApiProperty({ required: true })
  address: string;

  @ApiProperty({ required: true })
  mobile: string;

  @ApiProperty({ required: true })
  email: string;

  @ApiProperty({ required: true })
  introduction: string;

  @ApiProperty({ required: true })
  function: string;

  @ApiProperty({ required: false, type: [UnionImagesDto] })
  images: UnionImagesDto[];

  @ApiProperty({ required: false, type: [UnionMemberDto] })
  members: UnionMemberDto[];
}
