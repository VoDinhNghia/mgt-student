import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { EroomType } from 'src/constants/constant';
import { DiviceRoomDto } from './rooms.divice.dto';

export class CreateRoomDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: EroomType.CLASS_ROOM })
  type?: string;

  @IsNumber()
  @ApiProperty({ default: 100 })
  capacity?: number;

  @ApiPropertyOptional({ type: DiviceRoomDto })
  divice?: DiviceRoomDto;

  @ApiPropertyOptional()
  description?: string;
}
