import { ApiProperty } from '@nestjs/swagger';
import { EscholarshirpType } from 'src/commons/constants';

export class CreateScholarshipDto {
  @ApiProperty({ required: true })
  name?: string;

  @ApiProperty({ required: true })
  semester?: string;

  @ApiProperty({
    required: true,
    enum: EscholarshirpType,
    default: EscholarshirpType.EXCELLENCE,
  })
  type?: string;

  @ApiProperty({ required: true })
  content?: string;

  @ApiProperty({ required: false })
  attachment?: string[];
}
