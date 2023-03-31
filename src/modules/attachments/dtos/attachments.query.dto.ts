import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { QueryAttachmentCommonDto } from './attachments.query.common.dto';

export class QueryAttachmentDto extends QueryAttachmentCommonDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  uploadBy?: string;
}
