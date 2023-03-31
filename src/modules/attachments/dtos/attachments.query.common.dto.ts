import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { EmimetypeAttachment } from 'src/constants/constant';
import { QueryPagination } from 'src/utils/utils.page.query.pagination.dto';

export class QueryAttachmentCommonDto extends QueryPagination {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ enum: EmimetypeAttachment })
  mimetype?: string;
}
