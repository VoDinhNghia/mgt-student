import { ApiProperty } from '@nestjs/swagger';
import { GetCurrentDate } from 'src/utils/get.current-date';

export class UpdateMajorDto {
  @ApiProperty({ required: false })
  name?: string;

  @ApiProperty({ required: false })
  faculty?: string;

  @ApiProperty()
  introduction?: string;

  @ApiProperty({
    required: false,
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
