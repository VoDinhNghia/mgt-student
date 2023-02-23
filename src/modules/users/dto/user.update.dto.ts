import { ApiProperty } from '@nestjs/swagger';

export class UsersUpdateDto {
  @ApiProperty({ required: false })
  email?: string;

  @ApiProperty({ required: false })
  role?: string;

  @ApiProperty({ required: false })
  status?: string;

  @ApiProperty({ required: false, maxLength: 20, minLength: 6 })
  passWord?: string;
}
