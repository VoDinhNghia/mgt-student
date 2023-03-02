import { ApiProperty } from '@nestjs/swagger';
import { EtypeLeaderSchool } from 'src/constants/constant';

export class TitleLeaDerSchoolDto {
  @ApiProperty({ required: true })
  name: string;

  @ApiProperty({ required: true, default: new Date() })
  acceptDate: string;

  @ApiProperty({
    required: true,
    enum: EtypeLeaderSchool,
    default: EtypeLeaderSchool.PARTYCOMMITTEE,
  })
  type: string;
}
