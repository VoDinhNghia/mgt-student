import { ApiProperty } from '@nestjs/swagger';
import { EtypeLeaderSchool } from 'src/constants/constant';
import { GetCurrentDate } from 'src/utils/get.current-date';

export class TitleLeaDerSchoolDto {
  @ApiProperty({ required: true })
  name: string;

  @ApiProperty({
    required: true,
    default: new GetCurrentDate().getYearMonthDate(),
  })
  acceptDate: Date;

  @ApiProperty({
    required: true,
    enum: EtypeLeaderSchool,
    default: EtypeLeaderSchool.PARTYCOMMITTEE,
  })
  type: string;
}
