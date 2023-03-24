import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
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
