import { ApiProperty } from '@nestjs/swagger';
import { EtypeAward } from 'src/commons/constants';

export class CreateAwardDto {
  @ApiProperty({ required: true })
  name?: string;

  @ApiProperty({ required: true, default: '12-02-2023' })
  time?: string;

  @ApiProperty({ required: false, type: [String] })
  attachment?: [string];

  @ApiProperty({ required: true, default: 'IUH - Cơ sở Hồ Chí Minh' })
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
