import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { GetCurrentDate } from 'src/utils/get.current-date';

export class CreateFacultyDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  introduction?: string;

  @ApiProperty({ default: new GetCurrentDate().getYearMonthDate() })
  foundYear?: Date;

  @IsOptional()
  @IsArray()
  @ApiProperty({ type: [String] })
  award?: string[];

  @IsOptional()
  @IsString()
  @ApiProperty()
  headOfSection?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  eputeHead?: string;
}
