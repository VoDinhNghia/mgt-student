import { ApiProperty } from '@nestjs/swagger';

export class UnionImagesDto {
  @ApiProperty()
  attachment: string;

  @ApiProperty()
  description: string;
}
