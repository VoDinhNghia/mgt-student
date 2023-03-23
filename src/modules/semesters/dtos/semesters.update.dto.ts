import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateSemesterDto {
  @ApiPropertyOptional()
  name?: string;

  @ApiPropertyOptional({ default: '2016-2017' })
  year?: string;
}
