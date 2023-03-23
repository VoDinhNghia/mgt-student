import { ApiPropertyOptional } from '@nestjs/swagger';

export class DiviceRoomDto {
  @ApiPropertyOptional()
  airConditioner?: string;

  @ApiPropertyOptional()
  projector?: string;

  @ApiPropertyOptional()
  status?: string;
}
