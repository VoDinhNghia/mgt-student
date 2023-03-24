import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class DiviceRoomDto {
  @IsOptional()
  @IsString()
  @ApiProperty()
  airConditioner?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  projector?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  status?: string;
}
