import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsDate, IsOptional, IsString } from 'class-validator';
import { EtypeAward } from 'src/constants/constant';
import { GetCurrentDate } from 'src/utils/get.current-date';

export class UpdateAwardDto {
  @IsOptional()
  @IsString()
  @ApiProperty()
  name?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @ApiProperty({
    default: `${new GetCurrentDate().getYearMonthDate()}T00:00:00`,
  })
  time?: Date;

  @IsOptional()
  @IsArray()
  @ApiProperty({ type: [String] })
  attachment?: [string];

  @IsOptional()
  @IsString()
  @ApiProperty({ default: 'award - location' })
  location?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    enum: EtypeAward,
    default: EtypeAward.UNIVERSITY,
  })
  type?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  description?: string;
}
