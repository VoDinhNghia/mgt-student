import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { EscholarshirpType } from 'src/constants/constant';

export class UpdateScholarshipDto {
  @ApiPropertyOptional()
  name?: string;

  @ApiPropertyOptional()
  semester?: string;

  @ApiProperty({
    enum: EscholarshirpType,
    default: EscholarshirpType.EXCELLENCE,
  })
  type?: string;

  @ApiPropertyOptional()
  content?: string;

  @IsNumber()
  @ApiProperty({ default: 8.0 })
  minimunPoints?: number;

  @IsNumber()
  @ApiProperty({ default: 8.9 })
  maximunPoints?: number;

  @ApiPropertyOptional({ default: 65 })
  trainningPoints?: number;

  @ApiPropertyOptional({ default: 80 })
  percentTuition?: number;

  @ApiPropertyOptional({ default: 11 })
  numberCredit?: number;

  @ApiPropertyOptional({ type: [String] })
  attachment?: string[];
}
