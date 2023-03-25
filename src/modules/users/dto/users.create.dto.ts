import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { EuserGender } from 'src/constants/constant';
import { UsersDto } from './users.dto';

export class CreateUserDto extends UsersDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  lastName: string;

  @IsString()
  @ApiProperty()
  middleName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: '0984848480' })
  mobile: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ enum: EuserGender, default: EuserGender.MALE })
  gender: string;
}
