import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class BranchContactInfoDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @ApiPropertyOptional()
  fax: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  mobile: string;
}
