import { ApiProperty } from '@nestjs/swagger';

export class IdentityCardNumberDto {
  @ApiProperty({ required: false })
  id?: string;

  @ApiProperty({ required: false })
  date?: string;

  @ApiProperty({ required: false })
  location?: string;
}
