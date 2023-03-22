import { ApiProperty } from '@nestjs/swagger';
import { EuserGender } from 'src/constants/constant';
import { ApiResponseCommon } from 'src/utils/fields-common.response-swagger';
import { IdentityCardNumberDto } from '../dto/user.profile.identityCardNumber.dto';
import { LocationProfileDto } from '../dto/user.profile.location.dto';

export class ProfileResponse extends ApiResponseCommon {
  @ApiProperty()
  firstName?: string;

  @ApiProperty()
  user?: string;

  @ApiProperty()
  lastName?: string;

  @ApiProperty()
  middleName?: string;

  @ApiProperty()
  classId?: string;

  @ApiProperty()
  faculty?: string;

  @ApiProperty()
  major?: string;

  @ApiProperty()
  course?: string;

  @ApiProperty()
  degreeLevel?: string;

  @ApiProperty()
  avatar?: string;

  @ApiProperty({ required: false, default: '0948494849' })
  mobile?: string;

  @ApiProperty({
    required: false,
    enum: EuserGender,
    default: EuserGender.MALE,
  })
  gender?: string;

  @ApiProperty()
  dateOfBirth?: string;

  @ApiProperty()
  joinDate?: string;

  @ApiProperty()
  endDate?: string;

  @ApiProperty({
    required: false,
    type: [String],
    default: ['class president'],
  })
  positionHeld?: string[];

  @ApiProperty({ type: [String] })
  award?: string[];

  @ApiProperty({ type: LocationProfileDto })
  location?: LocationProfileDto;

  @ApiProperty({ type: IdentityCardNumberDto })
  identityCardNumber?: IdentityCardNumberDto;

  @ApiProperty()
  object?: string;

  @ApiProperty()
  unionDate?: string;

  @ApiProperty()
  communistPartyDay?: string;

  @ApiProperty()
  ethnic?: string;

  @ApiProperty()
  religion?: string;
}
