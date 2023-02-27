import { ApiProperty } from '@nestjs/swagger';

export class UpdateFacultyDto {
  @ApiProperty({ required: false })
  name?: string;

  @ApiProperty()
  introduction?: string;

  @ApiProperty({ required: false, default: '02-2023' })
  foundYear?: string;

  @ApiProperty({ required: false, type: [String] })
  award?: [string];

  @ApiProperty({ required: false })
  headOfSection?: string;

  @ApiProperty({ required: false })
  eputeHead?: string;
}
