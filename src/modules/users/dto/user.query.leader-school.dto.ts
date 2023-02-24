import { ApiProperty } from '@nestjs/swagger';
import { EtypeLeaderSchool } from 'src/commons/constants';

export class QueryLeaderSchoolDto {
  @ApiProperty({
    required: false,
    enum: EtypeLeaderSchool,
    default: EtypeLeaderSchool.PARTYCOMMITTEE,
  })
  type?: string;
}
