import { ApiProperty } from '@nestjs/swagger';
import { EuserGender } from 'src/commons/constants';
import { UsersDto } from './users.dto';

export class CreateUserDto extends UsersDto {
  @ApiProperty({ required: true })
  firstName: string;

  @ApiProperty({ required: true })
  lastName: string;

  @ApiProperty({ required: true })
  middleName: string;

  @ApiProperty({ required: true })
  mobile: number;

  @ApiProperty({ required: true, enum: EuserGender, default: EuserGender.MALE })
  gender: string;
}
