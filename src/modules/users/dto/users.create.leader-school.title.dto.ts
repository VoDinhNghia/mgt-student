import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';
import { EtypeLeaderSchool } from 'src/constants/constant';
import { GetCurrentDate } from 'src/utils/utils.get.current-date';

export class TitleLeaDerSchoolDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  @ApiProperty({
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
