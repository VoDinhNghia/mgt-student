import { ApiPropertyOptional } from '@nestjs/swagger';

export class BranchUpdateLocationDto {
  @ApiPropertyOptional()
  province: string;

  @ApiPropertyOptional()
  district: string;

  @ApiPropertyOptional()
  ward: string;

  @ApiPropertyOptional()
  country: string;

  @ApiPropertyOptional()
  address: string;
}
