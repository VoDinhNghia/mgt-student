import { ApiPropertyOptional } from '@nestjs/swagger';

export class IdentityCardNumberDto {
  @ApiPropertyOptional()
  id?: string;

  @ApiPropertyOptional()
  date?: string;

  @ApiPropertyOptional()
  location?: string;
}
