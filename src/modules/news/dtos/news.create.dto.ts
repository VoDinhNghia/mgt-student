import { ApiProperty } from '@nestjs/swagger';
import { typeNews } from 'src/constants/constant';
export class CreateNewDto {
  @ApiProperty({ required: true })
  title: string;

  @ApiProperty()
  content?: string;

  @ApiProperty({ required: true, enum: typeNews })
  type?: string;

  @ApiProperty()
  url?: string;

  @ApiProperty({ type: Array })
  attachment?: [string];
}
