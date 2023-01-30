import { ApiProperty } from '@nestjs/swagger';
import { UnionImagesDto } from './unions.images.dto';
import { UnionMemberDto } from './unions.member.dto';

export class UnionCreateDto {
  @ApiProperty()
  url: string;

  @ApiProperty()
  nameUnit: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  mobile: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  introduction: string;

  @ApiProperty()
  function: string;

  @ApiProperty({ type: Object })
  image: UnionImagesDto;

  @ApiProperty({ type: Array })
  member: [UnionMemberDto];
}
