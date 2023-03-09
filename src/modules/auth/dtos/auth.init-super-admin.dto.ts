import { ApiProperty } from '@nestjs/swagger';

export class InitSuperAdminDto {
  @ApiProperty({ required: true })
  email: string;

  @ApiProperty({ required: true })
  passWord: string;

  @ApiProperty({ required: true, default: 'Admin' })
  firstName?: string;

  @ApiProperty({ required: true, default: 'Supper' })
  lastName?: string;
}
