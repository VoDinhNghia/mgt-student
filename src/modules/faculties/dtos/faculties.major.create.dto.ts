import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateCommonDto } from './faculties.create-common.dto';

export class CreateMajorDto extends CreateCommonDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  faculty?: string;
}
