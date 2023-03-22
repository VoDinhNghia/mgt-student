import { ApiProperty } from '@nestjs/swagger';

export class ProfileLoginResponseDto {
  @ApiProperty()
  _id?: string;

  @ApiProperty()
  firstName?: string;

  @ApiProperty()
  lastName?: string;

  @ApiProperty()
  middleName?: string;
}
