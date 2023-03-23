import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsObject, IsString } from 'class-validator';
import { GetCurrentDate } from 'src/utils/get.current-date';
import { ContactInstituteDto } from './institute.contact.dto';
import { FunctionAndTaskInstituteDto } from './institute.function-task.dto';

export class CreateInstituteDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  unitName?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  url?: string;

  @ApiProperty({
    required: true,
    default: new GetCurrentDate().getYearMonthDate(),
  })
  foundYear?: Date;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  parson?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  viceParson?: string;

  @IsObject()
  @ApiProperty({ type: ContactInstituteDto })
  contacts?: ContactInstituteDto;

  @IsArray()
  @ApiProperty({ type: [FunctionAndTaskInstituteDto] })
  function?: FunctionAndTaskInstituteDto[];

  @IsArray()
  @ApiProperty({ type: [FunctionAndTaskInstituteDto] })
  task?: FunctionAndTaskInstituteDto[];

  @ApiPropertyOptional({ type: [String] })
  attachment?: string[];
}
