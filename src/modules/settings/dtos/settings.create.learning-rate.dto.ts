import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';
import { EtypeLearningRate } from 'src/constants/constant';

export class CreateSettingLearningRateDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: 'Pretty' })
  name?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    default: EtypeLearningRate.TEN_POINT_SCALE,
  })
  type?: string;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  @Max(10)
  @Min(0)
  @ApiProperty({ default: 7.0 })
  minimum?: number;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  @Max(10)
  @Min(0)
  @ApiProperty({ default: 7.9 })
  maximum?: number;
}
