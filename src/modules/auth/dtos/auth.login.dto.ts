import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ required: true })
  email: string;

  @ApiProperty({ required: true })
  passWord: string;
}
