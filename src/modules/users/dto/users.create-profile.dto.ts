import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { EuserGender } from 'src/constants/constant';
import { GetCurrentDate } from 'src/utils/get.current-date';
import { IdentityCardNumberDto } from './users.profile.identity-card-number.dto';
import { LocationProfileDto } from './users.profile.location.dto';
export class UserProfileDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  user: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  firstName?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  lastName?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  middleName?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  classId?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  faculty?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  major?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  course?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  degreeLevel?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  avatar?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ default: '0948494849' })
  mobile?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    enum: EuserGender,
    default: EuserGender.MALE,
  })
  gender?: string;

  @IsOptional()
  @ApiProperty({ default: new GetCurrentDate().getYearMonthDate() })
  @ApiProperty()
  dateOfBirth?: Date;

  @IsOptional()
  @ApiProperty({ default: new GetCurrentDate().getYearMonthDate() })
  joinDate?: Date;

  @IsOptional()
  @ApiProperty({ default: new GetCurrentDate().getYearMonthDate() })
  @ApiProperty()
  endDate?: string;

  @IsOptional()
  @IsArray()
  @ApiProperty({
    type: [String],
    default: ['class president'],
  })
  positionHeld?: string[];

  @IsOptional()
  @IsArray()
  @ApiProperty({
    type: [String],
    description: 'Should award old and award new',
  })
  award?: string[];

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => LocationProfileDto)
  @ApiProperty()
  location?: LocationProfileDto;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => IdentityCardNumberDto)
  @ApiProperty()
  identityCardNumber?: IdentityCardNumberDto;

  @IsOptional()
  @IsString()
  @ApiProperty()
  object?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  unionDate?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  communistPartyDay?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  ethnic?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  religion?: string;
}
