import { ApiProperty } from '@nestjs/swagger';

export class BranchLocationDto {
  @ApiProperty()
  province: string;

  @ApiProperty()
  district: string;

  @ApiProperty({ required: false })
  ward: string;

  @ApiProperty()
  country: string;

  @ApiProperty({ required: true })
  address: string;
}
