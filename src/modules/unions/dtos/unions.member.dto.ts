import { ApiPropertyOptional } from '@nestjs/swagger';

export class UnionMemberDto {
  @ApiPropertyOptional()
  user: string;

  @ApiPropertyOptional()
  position: string;
}
