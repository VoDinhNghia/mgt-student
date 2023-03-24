import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsObject, IsOptional, IsString } from 'class-validator';
import { EroomType } from 'src/constants/constant';
import { DiviceRoomDto } from './rooms.divice.dto';

export class UpdateRoomDto {
  @IsOptional()
  @IsString()
  @ApiProperty()
  name?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ default: EroomType.CLASS_ROOM })
  type?: string;

  @IsOptional()
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
