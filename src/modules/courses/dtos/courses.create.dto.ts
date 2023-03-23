import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: 'K12' })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: '2016-2017', description: '2016-2017' })
  year?: string;

  @IsNumber()
  @ApiProperty({ default: 0 })
  total?: number;
}
