import { ApiPropertyOptional } from '@nestjs/swagger';

export class UnionImagesDto {
  @ApiPropertyOptional()
  attachment: string;

  @ApiPropertyOptional()
  description: string;
}
