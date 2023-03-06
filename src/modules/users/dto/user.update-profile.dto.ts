import { ApiProperty } from '@nestjs/swagger';
import { EuserGender } from 'src/constants/constant';
import { IdentityCardNumberDto } from './user.profile.identityCardNumber.dto';
import { LocationProfileDto } from './user.profile.location.dto';

export class UpdateProfileDto {
  @ApiProperty({ required: false })
  firstName?: string;

  @ApiProperty({ required: false })
  lastName?: string;

  @ApiProperty({ required: false })
  middleName?: string;

  @ApiProperty({ required: false })
  classId?: string;

  @ApiProperty({ required: false })
  faculty?: string;

  @ApiProperty({ required: false })
  major?: string;

  @ApiProperty({ required: false })
  course?: string;

  @ApiProperty({ required: false })
  department?: string;

  @ApiProperty({ required: false })
  degreeLevel?: string;

  @ApiProperty({ required: false })
  avatar?: string;

  @ApiProperty({ required: false, default: '0948494849' })
  mobile?: string;

  @ApiProperty({
    required: false,
    enum: EuserGender,
    default: EuserGender.MALE,
  })
  gender?: string;

  @ApiProperty({ required: false })
  dateOfBirth?: string;

  @ApiProperty({ required: false })
  joinDate?: string;

  @ApiProperty({ required: false })
  endDate?: string;

  @ApiProperty({
    required: false,
    type: [String],
    default: ['class president'],
  })
  positionHeld?: string[];

  @ApiProperty({ required: false, type: [String] }) // Should award old and award new
  award?: string[];

  @ApiProperty({ required: false, type: LocationProfileDto })
  location?: LocationProfileDto;

  @ApiProperty({ required: false, type: IdentityCardNumberDto })
  identityCardNumber?: IdentityCardNumberDto;

  @ApiProperty({ required: false })
  object?: string;

  @ApiProperty({ required: false })
  unionDate?: string;

  @ApiProperty({ required: false })
  communistPartyDay?: string;

  @ApiProperty({ required: false })
  ethnic?: string;

  @ApiProperty({ required: false })
  religion?: string;
}
