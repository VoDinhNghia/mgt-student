import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
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
  @Type(() => Number)
  @Min(0)
  @Max(10000)
  @ApiProperty({ default: 100 })
  capacity?: number;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => DiviceRoomDto)
  @ApiProperty()
  divice?: DiviceRoomDto;

  @IsOptional()
  @IsString()
  @ApiProperty()
  description?: string;
}
