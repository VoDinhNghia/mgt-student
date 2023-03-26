import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
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
  @Type(() => Number)
  @Min(0)
  @Max(10)
  @ApiProperty({ default: 8.0 })
  minimunPoints?: number;

  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @Max(10)
  @ApiProperty({ default: 8.9 })
  maximunPoints?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @Max(100)
  @ApiProperty({ default: 65 })
  trainningPoints?: number;

  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @Max(100)
  @ApiProperty({ default: 80 })
  percentTuition?: number;

  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @Max(50)
  @ApiProperty({ default: 11 })
  numberCredit?: number;

  @IsOptional()
  @IsArray()
  @ApiProperty({ type: [String] })
  attachment?: string[];
}
