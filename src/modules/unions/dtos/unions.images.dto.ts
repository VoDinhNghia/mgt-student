import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UnionImagesDto {
  @IsOptional()
  @IsString()
  @ApiProperty()
  attachment: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  description: string;
}
