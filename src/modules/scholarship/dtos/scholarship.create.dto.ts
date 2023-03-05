import { ApiProperty } from '@nestjs/swagger';
import { EscholarshirpType } from 'src/constants/constant';

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

  @ApiProperty({ default: 8.0, required: true })
  minimunPoints?: number;

  @ApiProperty({ default: 8.9, required: true })
  maximunPoints?: number;

  @ApiProperty({ default: 65, required: false })
  trainningPoints?: number;

  @ApiProperty({ default: 80, required: true })
  percentTuition?: number;

  @ApiProperty({ required: false })
  attachment?: string[];
}
