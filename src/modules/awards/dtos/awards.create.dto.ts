import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { EtypeAward } from 'src/constants/constant';
import { GetCurrentDate } from 'src/utils/utils.get.current-date';

export class CreateAwardDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name?: string;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  @ApiProperty({
    default: `${new GetCurrentDate().getYearMonthDate()}`,
  })
  time?: Date;

  @IsOptional()
  @IsArray()
  @ApiProperty({ type: [String] })
  attachment?: string[];

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: 'location receipt award' })
  location?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    enum: EtypeAward,
    default: EtypeAward.UNIVERSITY,
  })
  type?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  description?: string;
}
