import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ErolesUser } from 'src/constants/constant';
export class UsersDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  @MinLength(6)
  @ApiProperty()
  passWord?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    enum: ErolesUser,
    default: ErolesUser.STUDENT,
  })
  role?: string;
}
