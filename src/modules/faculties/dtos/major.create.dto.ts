import { ApiProperty } from '@nestjs/swagger';

export class CreateMajorDto {
  @ApiProperty({ required: true })
  name?: string;

  @ApiProperty({ required: true })
  faculty?: string;

  @ApiProperty()
  introduction?: string;

  @ApiProperty({ required: true, default: '02-2023' })
  foundYear?: string;

  @ApiProperty({ required: false, type: [String] })
  award?: [string];

  @ApiProperty({ required: false })
  headOfSection?: string;

  @ApiProperty({ required: false })
  eputeHead?: string;
}
