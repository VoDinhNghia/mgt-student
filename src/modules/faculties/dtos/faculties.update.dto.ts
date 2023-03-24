import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsDate, IsOptional, IsString } from 'class-validator';
import { GetCurrentDate } from 'src/utils/get.current-date';

export class UpdateFacultyDto {
  @IsOptional()
  @IsString()
  @ApiProperty()
  name?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  introduction?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @ApiProperty({ default: new GetCurrentDate().getYearMonthDate() })
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
