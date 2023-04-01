import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Max, Min } from 'class-validator';

export class UpdatePointSubjectRegisterDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Max(10)
  @Min(0)
  @ApiProperty()
  midtermScore?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Max(10)
  @Min(0)
  @ApiProperty()
  finalScore?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Max(10)
  @Min(0)
  @ApiProperty()
  essayScore?: number;
}
