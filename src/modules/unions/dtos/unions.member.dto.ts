import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UnionMemberDto {
  @IsOptional()
  @IsString()
  @ApiProperty()
  user: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  position: string;
}
