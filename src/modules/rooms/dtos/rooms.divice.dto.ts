import { ApiProperty } from '@nestjs/swagger';

export class DiviceRoomDto {
  @ApiProperty({ required: false })
  airConditioner?: string;

  @ApiProperty({ required: false })
  projector?: string;

  @ApiProperty({ required: false })
  status?: string;
}
