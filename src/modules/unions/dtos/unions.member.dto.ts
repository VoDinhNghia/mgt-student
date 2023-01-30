import { ApiProperty } from '@nestjs/swagger';

export class UnionMemberDto {
  @ApiProperty()
  user: string;

  @ApiProperty()
  position: string;
}
