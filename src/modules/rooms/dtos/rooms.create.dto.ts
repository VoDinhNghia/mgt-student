import { ApiProperty } from '@nestjs/swagger';
import { EroomType } from 'src/constants/constant';
import { DiviceRoomDto } from './rooms.divice.dto';

export class CreateRoomDto {
  @ApiProperty({ required: true })
  name?: string;

  @ApiProperty({ required: true, default: EroomType.CLASS_ROOM })
  type?: string;

  @ApiProperty({ required: true, default: 100 })
  capacity?: number;

  @ApiProperty({ required: false, type: DiviceRoomDto })
  divice?: DiviceRoomDto;

  @ApiProperty({ required: false })
  description?: string;
}
