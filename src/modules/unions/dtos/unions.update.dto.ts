import { ApiPropertyOptional } from '@nestjs/swagger';
import { UnionImagesDto } from './unions.images.dto';
import { UnionMemberDto } from './unions.member.dto';

export class UpdateUnionDto {
  @ApiPropertyOptional()
  url: string;

  @ApiPropertyOptional()
  nameUnit: string;

  @ApiPropertyOptional()
  address: string;

  @ApiPropertyOptional()
  mobile: string;

  @ApiPropertyOptional()
  email: string;

  @ApiPropertyOptional()
  introduction: string;

  @ApiPropertyOptional()
  function: string;

  @ApiPropertyOptional({ type: [UnionImagesDto] })
  images: UnionImagesDto[];

  @ApiPropertyOptional({ type: [UnionMemberDto] })
  members: UnionMemberDto[];
}
