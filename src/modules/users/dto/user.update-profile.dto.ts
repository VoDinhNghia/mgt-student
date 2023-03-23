import { ApiPropertyOptional } from '@nestjs/swagger';
import { EuserGender } from 'src/constants/constant';
import { IdentityCardNumberDto } from './user.profile.identityCardNumber.dto';
import { LocationProfileDto } from './user.profile.location.dto';

export class UpdateProfileDto {
  @ApiPropertyOptional()
  firstName?: string;

  @ApiPropertyOptional()
  lastName?: string;

  @ApiPropertyOptional()
  middleName?: string;

  @ApiPropertyOptional()
  classId?: string;

  @ApiPropertyOptional()
  faculty?: string;

  @ApiPropertyOptional()
  major?: string;

  @ApiPropertyOptional()
  course?: string;

  @ApiPropertyOptional()
  degreeLevel?: string;

  @ApiPropertyOptional()
  avatar?: string;

  @ApiPropertyOptional({ default: '0948494849' })
  mobile?: string;

  @ApiPropertyOptional({
    enum: EuserGender,
    default: EuserGender.MALE,
  })
  gender?: string;

  @ApiPropertyOptional()
  dateOfBirth?: string;

  @ApiPropertyOptional()
  joinDate?: string;

  @ApiPropertyOptional()
  endDate?: string;

  @ApiPropertyOptional({
    type: [String],
    default: ['class president'],
  })
  positionHeld?: string[];

  @ApiPropertyOptional({
    type: [String],
    description: 'Should award old and award new',
  })
  award?: string[];

  @ApiPropertyOptional({ type: LocationProfileDto })
  location?: LocationProfileDto;

  @ApiPropertyOptional({ type: IdentityCardNumberDto })
  identityCardNumber?: IdentityCardNumberDto;

  @ApiPropertyOptional()
  object?: string;

  @ApiPropertyOptional()
  unionDate?: string;

  @ApiPropertyOptional()
  communistPartyDay?: string;

  @ApiPropertyOptional()
  ethnic?: string;

  @ApiPropertyOptional()
  religion?: string;
}
