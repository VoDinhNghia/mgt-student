import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { FileRequestDto } from 'src/utils/file-request.dto';

export class CreateAttachmentDto extends FileRequestDto {
  @IsString()
  @IsNotEmpty()
  uploadBy?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  url?: string;
}
