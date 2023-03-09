import { ApiProperty } from '@nestjs/swagger';
import { FileRequestDto } from 'src/utils/file-request.dto';

export class CreateAttachmentDto extends FileRequestDto {
  @ApiProperty({ required: true })
  uploadBy?: string;
}
