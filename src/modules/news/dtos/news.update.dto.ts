import { ApiPropertyOptional } from '@nestjs/swagger';
import { EtypeNews } from 'src/constants/constant';
export class UpdateNewDto {
  @ApiPropertyOptional()
  title?: string;

  @ApiPropertyOptional({ enum: EtypeNews, default: EtypeNews.UNIVERSITY })
  type?: string;

  @ApiPropertyOptional({ type: [String] })
  attachment?: string[];
}
