import { ApiProperty } from '@nestjs/swagger';
import { EtypeNews } from 'src/constants/constant';
export class CreateNewDto {
  @ApiProperty({ required: true })
  title: string;

  @ApiProperty()
  content?: string;

  @ApiProperty({
    required: true,
    enum: EtypeNews,
    default: EtypeNews.UNIVERSITY,
  })
  type?: string;

  @ApiProperty()
  url?: string;

  @ApiProperty({ type: Array })
  attachment?: [string];
}
