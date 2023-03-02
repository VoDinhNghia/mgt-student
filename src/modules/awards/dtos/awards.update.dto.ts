import { ApiProperty } from '@nestjs/swagger';
import { EtypeAward } from 'src/constants/constant';

export class UpdateAwardDto {
  @ApiProperty({ required: false })
  name?: string;

  @ApiProperty({ required: false, default: '2023-12-01T17:00:00' })
  time?: string;

  @ApiProperty({ required: false, type: [String] })
  attachment?: [string];

  @ApiProperty({ required: false, default: 'IUH - Cơ sở Hồ Chí Minh' })
  location?: string;

  @ApiProperty({
    required: false,
    enum: EtypeAward,
    default: EtypeAward.UNIVERSITY,
  })
  type?: string;

  @ApiProperty({ required: false })
  description?: string;
}
