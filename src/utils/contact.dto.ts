import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ContactCommonDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  office?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  email?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  phone?: string;

  @ApiPropertyOptional()
  fax?: string;
}
