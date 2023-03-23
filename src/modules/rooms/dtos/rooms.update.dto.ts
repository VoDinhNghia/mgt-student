import { ApiPropertyOptional } from '@nestjs/swagger';
import { EroomType } from 'src/constants/constant';
import { DiviceRoomDto } from './rooms.divice.dto';

export class UpdateRoomDto {
  @ApiPropertyOptional()
  name?: string;

  @ApiPropertyOptional({ default: EroomType.CLASS_ROOM })
  type?: string;

  @ApiPropertyOptional({ default: 100 })
  capacity?: number;

  @ApiPropertyOptional({ type: DiviceRoomDto })
  divice?: DiviceRoomDto;

  @ApiPropertyOptional()
  description?: string;
}
