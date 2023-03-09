import { ApiProperty } from '@nestjs/swagger';

export class FileRequestDto {
  @ApiProperty({ required: true })
  originalname?: string;

  @ApiProperty({ required: true })
  filename?: string;

  @ApiProperty({ required: true })
  path?: string;

  @ApiProperty({ required: true })
  destination?: string;

  @ApiProperty({ required: true })
  mimetype?: string;

  @ApiProperty({ required: true })
  url?: string;
}
