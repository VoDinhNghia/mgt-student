import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';
import { EstatusUser } from 'src/constants/constant';

export class UsersUpdateDto {
  @IsString()
  @ApiProperty()
  email?: string;

  @ApiProperty()
  role?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    enum: EstatusUser,
    default: EstatusUser.INACTIVE,
  })
  status?: string;

  @IsOptional()
  @IsString()
  @Length(6, 20)
  @ApiProperty()
  passWord?: string;
}
