import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class BranchUpdateContactInfoDto {
  @IsOptional()
  @IsString()
  @ApiProperty()
  email: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  fax: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  mobile: string;
}
