import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateClassDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  course?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: 'DHKHMT12A' })
  name?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  degreeLevel?: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ default: 50 })
  classSize?: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  major?: string;

  @ApiPropertyOptional()
  homeroomteacher?: string;
}
