import { ApiProperty } from '@nestjs/swagger';

export class BranchContactInfoDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  fax: string;

  @ApiProperty()
  mobile: string;
}
