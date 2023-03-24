import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class OutputCourseDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: 400, description: '400, 450, 500 ...' })
  toeic?: string;

  @IsBoolean()
  @ApiProperty({ default: true })
  it?: boolean;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'GDTC, GDQP ...' })
  conditionDiff?: string;
}
