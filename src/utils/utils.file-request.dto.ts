import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { EmimetypeAttachment } from 'src/constants/constant';

export class FileRequestDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  originalname?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  filename?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  path?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  destination?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ enum: EmimetypeAttachment })
  mimetype?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  url?: string;
}
