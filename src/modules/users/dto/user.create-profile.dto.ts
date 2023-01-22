import { ApiProperty } from '@nestjs/swagger';
export class UserProfileDto {
  @ApiProperty()
  user: string;

  @ApiProperty()
  firstName?: string;

  @ApiProperty()
  lastName?: string;
}
