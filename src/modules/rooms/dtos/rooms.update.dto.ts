import { ApiProperty } from '@nestjs/swagger';
import { EroomType } from 'src/commons/constants';
import { DiviceRoomDto } from './rooms.divice.dto';

export class UpdateRoomDto {
  @ApiProperty({ required: false })
  name?: string;

  @ApiProperty({ required: false, default: EroomType.CLASS_ROOM })
  type?: string;

  @ApiProperty({ required: false, default: 100 })
  capacity?: number;

  @ApiProperty({ required: false, type: DiviceRoomDto })
  divice?: DiviceRoomDto;

  @ApiProperty({ required: false })
  description?: string;
}
