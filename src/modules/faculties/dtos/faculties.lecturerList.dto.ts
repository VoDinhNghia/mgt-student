import { ApiProperty } from '@nestjs/swagger';
export class LecturerListDto {
  @ApiProperty({ required: true })
  lecturer?: string;

  @ApiProperty({ default: false })
  headOfSection?: boolean;

  @ApiProperty({ default: false })
  eputyHead?: boolean;
}
