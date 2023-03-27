import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUnionMemberDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  union?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  joinDate?: Date;

  @IsOptional()
  @IsString()
  @ApiProperty()
  user: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  position: string;
}
