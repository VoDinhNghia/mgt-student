import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsNotEmpty, IsString } from 'class-validator';

export class CreateTrainningPointDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  user?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  semester?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  program?: string;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({ default: true })
  status?: boolean;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  @ApiProperty()
  attendance?: Date;
}
