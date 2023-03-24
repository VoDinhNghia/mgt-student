import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class BranchContactInfoDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  fax: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  mobile: string;
}
