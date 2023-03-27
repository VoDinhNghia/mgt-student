import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUnionImagesDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  union?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  attachment: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  description: string;
}
