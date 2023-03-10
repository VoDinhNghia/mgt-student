import { ApiProperty } from '@nestjs/swagger';
import { EtypeNews } from 'src/constants/constant';
export class UpdateNewDto {
  @ApiProperty({ required: false })
  title?: string;

  @ApiProperty({
    enum: EtypeNews,
    required: false,
    default: EtypeNews.UNIVERSITY,
  })
  type?: string;

  @ApiProperty({ type: [String], required: false })
  attachment?: string[];
}
