import { ApiPropertyOptional } from '@nestjs/swagger';

export class BranchUpdateContactInfoDto {
  @ApiPropertyOptional()
  email: string;

  @ApiPropertyOptional()
  fax: string;

  @ApiPropertyOptional()
  mobile: string;
}
