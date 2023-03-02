import { ApiProperty } from '@nestjs/swagger';
import { ErolesEnum } from 'src/constants/constant';
export class UsersDto {
  @ApiProperty({ required: true })
  email: string;

  @ApiProperty({ required: true, maxLength: 20, minLength: 6 })
  passWord?: string;

  @ApiProperty({
    required: true,
    enum: ErolesEnum,
    default: ErolesEnum.STUDENT,
  })
  role?: string;
}
