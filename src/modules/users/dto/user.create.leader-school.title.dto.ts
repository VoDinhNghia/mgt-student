import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { EtypeLeaderSchool } from 'src/constants/constant';
import { GetCurrentDate } from 'src/utils/get.current-date';

export class TitleLeaDerSchoolDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @ApiProperty({
    required: true,
    default: new GetCurrentDate().getYearMonthDate(),
  })
  acceptDate: Date;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    enum: EtypeLeaderSchool,
    default: EtypeLeaderSchool.PARTYCOMMITTEE,
  })
  type: string;
}
