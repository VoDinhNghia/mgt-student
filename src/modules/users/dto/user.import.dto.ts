import { ApiProperty } from '@nestjs/swagger';

export class UserImportDto {
  @ApiProperty()
  email?: string;

  @ApiProperty()
  role?: string;

  @ApiProperty()
  gender?: string;

  @ApiProperty()
  mobile?: string;

  @ApiProperty()
  middleName?: string;

  @ApiProperty()
  lastName?: string;

  @ApiProperty()
  firstName?: string;
}
