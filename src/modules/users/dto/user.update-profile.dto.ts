import { ApiProperty } from '@nestjs/swagger';

export class ProfileUpdateDto {
  @ApiProperty()
  firstName?: string;

  @ApiProperty()
  lastName?: string;
}
