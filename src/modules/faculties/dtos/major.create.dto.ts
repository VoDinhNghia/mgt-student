import { ApiProperty } from '@nestjs/swagger';
import { GetCurrentDate } from 'src/utils/get.current-date';

export class CreateMajorDto {
  @ApiProperty({ required: true })
  name?: string;

  @ApiProperty({ required: true })
  faculty?: string;

  @ApiProperty()
  introduction?: string;

  @ApiProperty({
    required: true,
    default: new GetCurrentDate().getYearMonthDate(),
  })
  foundYear?: Date;

  @ApiProperty({ required: false, type: [String] })
  award?: [string];

  @ApiProperty({ required: false })
  headOfSection?: string;

  @ApiProperty({ required: false })
  eputeHead?: string;
}
