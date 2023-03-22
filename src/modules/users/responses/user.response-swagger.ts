import { ApiProperty } from '@nestjs/swagger';
import { ApiResponseCommon } from 'src/utils/fields-common.response-swagger';
import { ProfileResponse } from './profile.response-swagger';

export class UserResponse extends ApiResponseCommon {
  @ApiProperty()
  email: string;

  @ApiProperty()
  passWord: string;

  @ApiProperty()
  role: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  statusLogin: boolean;

  @ApiProperty({ type: [] })
  historyLogin: [];

  @ApiProperty({ type: ProfileResponse })
  profile: ProfileResponse;
}
