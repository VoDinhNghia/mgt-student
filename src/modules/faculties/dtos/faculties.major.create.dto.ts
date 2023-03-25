import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { GetCurrentDate } from 'src/utils/get.current-date';

export class CreateMajorDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  faculty?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  introduction?: string;

  @IsDate()
  @Type(() => Date)
  @ApiProperty({
    required: true,
    default: new GetCurrentDate().getYearMonthDate(),
  })
  foundYear?: Date;

  @IsOptional()
  @IsArray()
  @ApiProperty({ type: [String] })
  award?: [string];

  @IsOptional()
  @IsString()
  @ApiProperty()
  headOfSection?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  eputeHead?: string;
}
