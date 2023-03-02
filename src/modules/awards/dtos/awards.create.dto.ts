import { ApiProperty } from '@nestjs/swagger';
import { EtypeAward } from 'src/constants/constant';

export class CreateAwardDto {
  @ApiProperty({ required: true })
  name?: string;

  @ApiProperty({ required: true, default: '2023-12-01T17:00:00' })
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
