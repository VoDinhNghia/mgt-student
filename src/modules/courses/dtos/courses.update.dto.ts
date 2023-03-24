import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
export class UpdateCourseDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ default: 'DHKHMT12A' })
  name: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ default: '2016-2017' })
  year?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @ApiProperty({ default: 0 })
  total?: number;
}
