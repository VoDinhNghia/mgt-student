import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { EscholarshirpType } from 'src/constants/constant';

export class CreateScholarshipDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  semester?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    enum: EscholarshirpType,
    default: EscholarshirpType.EXCELLENCE,
  })
  type?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  content?: string;

  @IsNumber()
  @ApiProperty({ default: 8.0 })
  minimunPoints?: number;

  @IsNumber()
  @ApiProperty({ default: 8.9 })
  maximunPoints?: number;

  @ApiPropertyOptional({ default: 65 })
  trainningPoints?: number;

  @IsNumber()
  @ApiProperty({ default: 80 })
  percentTuition?: number;

  @IsNumber()
  @ApiProperty({ default: 11 })
  numberCredit?: number;

  @ApiPropertyOptional({ type: [String] })
  attachment?: string[];
}
