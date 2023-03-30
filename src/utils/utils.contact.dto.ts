import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ContactCommonDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  office?: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  phone?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  fax?: string;
}
