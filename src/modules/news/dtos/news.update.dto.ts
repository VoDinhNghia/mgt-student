import { ApiProperty } from '@nestjs/swagger';
import { typeNews } from 'src/constants/constant';
export class UpdateNewDto {
  @ApiProperty({ required: false })
  title?: string;

  @ApiProperty({ enum: typeNews, required: false })
  type?: string;
}
