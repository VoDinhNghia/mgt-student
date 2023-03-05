import { ApiProperty } from '@nestjs/swagger';
import { EuserGender } from 'src/constants/constant';
import { UsersDto } from './users.dto';

export class CreateUserDto extends UsersDto {
  @ApiProperty({ required: true })
  firstName: string;

  @ApiProperty({ required: true })
  lastName: string;

  @ApiProperty({ required: true })
  middleName: string;

  @ApiProperty({ required: true, default: '0984848480' })
  mobile: string;

  @ApiProperty({ required: true, enum: EuserGender, default: EuserGender.MALE })
  gender: string;
}
