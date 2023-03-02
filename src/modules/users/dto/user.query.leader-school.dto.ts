import { ApiProperty } from '@nestjs/swagger';
import { EtypeLeaderSchool } from 'src/constants/constant';

export class QueryLeaderSchoolDto {
  @ApiProperty({
    required: false,
    enum: EtypeLeaderSchool,
    default: EtypeLeaderSchool.PARTYCOMMITTEE,
  })
  type?: string;
}
