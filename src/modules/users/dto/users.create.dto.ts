import { ApiProperty } from '@nestjs/swagger';
import { UsersDto } from './users.dto';

export class CreateUserDto extends UsersDto {
  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  middleName: string;

  @ApiProperty()
  mobile: number;

  @ApiProperty()
  gender: string;
}
