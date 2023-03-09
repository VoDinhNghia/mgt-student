import { ApiProperty } from '@nestjs/swagger';
import { EtypeAward } from 'src/constants/constant';
import { GetCurrentDate } from 'src/utils/get.current-date';

export class CreateAwardDto {
  @ApiProperty({ required: true })
  name?: string;

  @ApiProperty({
    required: true,
    default: `${new GetCurrentDate().getYearMonthDate()}T00:00:00`,
  })
  time?: Date;

  @ApiProperty({ required: false, type: [String] })
  attachment?: string[];

  @ApiProperty({ required: true, default: 'location receipt award' })
  location?: string;

  @ApiProperty({
    required: true,
    enum: EtypeAward,
    default: EtypeAward.UNIVERSITY,
  })
  type?: string;

  @ApiProperty({ required: true })
  description?: string;
}
