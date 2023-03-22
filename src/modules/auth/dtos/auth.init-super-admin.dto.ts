import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class InitSuperAdminDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  passWord: string;

  @IsString()
  @ApiProperty({ default: 'Admin' })
  firstName: string;

  @IsString()
  @ApiProperty({ default: 'Supper' })
  lastName: string;
}
