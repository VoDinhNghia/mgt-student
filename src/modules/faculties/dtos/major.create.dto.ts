import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
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

  @ApiPropertyOptional()
  introduction?: string;

  @ApiProperty({
    required: true,
    default: new GetCurrentDate().getYearMonthDate(),
  })
  foundYear?: Date;

  @ApiPropertyOptional({ type: [String] })
  award?: [string];

  @ApiPropertyOptional()
  headOfSection?: string;

  @ApiPropertyOptional()
  eputeHead?: string;
}
