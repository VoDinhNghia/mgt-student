import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class InitSuperAdminDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  @MinLength(6)
  @ApiProperty()
  passWord: string;

  @IsString()
  @ApiProperty({ default: 'Admin' })
  firstName: string;

  @IsString()
  @ApiProperty({ default: 'Supper' })
  lastName: string;
}
