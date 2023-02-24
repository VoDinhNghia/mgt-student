import { ApiProperty } from '@nestjs/swagger';
import { UnionImagesDto } from './unions.images.dto';
import { UnionMemberDto } from './unions.member.dto';

export class UpdateUnionDto {
  @ApiProperty({ required: false })
  url: string;

  @ApiProperty({ required: false })
  nameUnit: string;

  @ApiProperty({ required: false })
  address: string;

  @ApiProperty({ required: false })
  mobile: string;

  @ApiProperty({ required: false })
  email: string;

  @ApiProperty({ required: false })
  introduction: string;

  @ApiProperty({ required: false })
  function: string;

  @ApiProperty({ required: false, type: [UnionImagesDto] })
  images: UnionImagesDto[];

  @ApiProperty({ required: false, type: [UnionMemberDto] })
  members: UnionMemberDto[];
}
