import { ApiProperty } from '@nestjs/swagger';
export class UsersDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  passWord?: string;

  @ApiProperty()
  role?: string;
}
