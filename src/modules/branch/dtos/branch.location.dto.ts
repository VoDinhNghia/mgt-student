import { ApiProperty } from '@nestjs/swagger';

export class BranchLocationDto {
  @ApiProperty()
  province: string;

  @ApiProperty()
  country: string;

  @ApiProperty()
  address: string;
}
