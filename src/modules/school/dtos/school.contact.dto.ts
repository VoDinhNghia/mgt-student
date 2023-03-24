import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class ContactSchoolDto {
  @IsOptional()
  @IsEmail()
  @ApiProperty()
  email?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  fax?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  mobile?: string;
}
