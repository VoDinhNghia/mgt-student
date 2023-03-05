import { ApiProperty } from '@nestjs/swagger';
import { EscholarshirpType } from 'src/constants/constant';

export class UpdateScholarshipDto {
  @ApiProperty({ required: false })
  name?: string;

  @ApiProperty({ required: false })
  semester?: string;

  @ApiProperty({
    required: false,
    enum: EscholarshirpType,
    default: EscholarshirpType.EXCELLENCE,
  })
  type?: string;

  @ApiProperty({ required: false })
  content?: string;

  @ApiProperty({ default: 8.0, required: true })
  minimunPoints?: number;

  @ApiProperty({ default: 8.9, required: true })
  maximunPoints?: number;

  @ApiProperty({ default: 65, required: false })
  trainningPoints?: number;

  @ApiProperty({ default: 80, required: false })
  percentTuition?: number;

  @ApiProperty({ required: false })
  attachment?: string[];
}
