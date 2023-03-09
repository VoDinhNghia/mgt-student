import { ApiProperty } from '@nestjs/swagger';

export class BranchUpdateLocationDto {
  @ApiProperty({ required: false })
  province: string;

  @ApiProperty({ required: false })
  district: string;

  @ApiProperty({ required: false })
  ward: string;

  @ApiProperty({ required: false })
  country: string;

  @ApiProperty({ required: false })
  address: string;
}
