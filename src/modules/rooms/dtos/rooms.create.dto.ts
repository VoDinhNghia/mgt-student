import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
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

  @IsOptional()
  @IsObject()
  @ApiProperty({ type: DiviceRoomDto })
  divice?: DiviceRoomDto;

  @IsOptional()
  @IsString()
  @ApiProperty()
  description?: string;
}
