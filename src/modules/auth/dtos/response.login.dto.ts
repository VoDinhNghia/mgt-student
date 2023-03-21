import { ApiProperty } from '@nestjs/swagger';
import { ProfileLoginResponseDto } from './response.login-profile.dto';

export class UserLoginResponseDto {
  @ApiProperty()
  _id?: string;

  @ApiProperty()
  userId?: string;

  @ApiProperty()
  role?: string;

  @ApiProperty()
  status?: string;

  @ApiProperty()
  email?: string;

  @ApiProperty()
  passWord?: string;

  @ApiProperty()
  statusLogin?: boolean;

  @ApiProperty()
  historyLogin?: any;

  @ApiProperty()
  profileId?: string;

  @ApiProperty({ type: ProfileLoginResponseDto })
  profile?: ProfileLoginResponseDto;
}
