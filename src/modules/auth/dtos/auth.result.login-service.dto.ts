import { ApiProperty } from '@nestjs/swagger';
import { ProfileLoginResponseDto } from './auth.result.login-profile-service.dto';

export class UserLoginResponseDto {
  @ApiProperty()
  _id?: string;

  @ApiProperty()
  role?: string;

  @ApiProperty()
  status?: string;

  @ApiProperty()
  email?: string;

  @ApiProperty()
  statusLogin?: boolean;

  @ApiProperty()
  profileId?: string;

  @ApiProperty({ type: ProfileLoginResponseDto })
  profile?: ProfileLoginResponseDto;

  @ApiProperty()
  accessToken?: string;
}
