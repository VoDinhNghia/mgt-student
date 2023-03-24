import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsObject, IsOptional, IsString } from 'class-validator';
import { GetCurrentDate } from 'src/utils/get.current-date';
import { ContactInstituteDto } from './institute.contact.dto';
import { FunctionAndTaskInstituteDto } from './institute.function-task.dto';

export class UpdateInstituteDto {
  @IsOptional()
  @IsString()
  @ApiProperty()
  unitName?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  url?: string;

  @IsOptional()
  @ApiProperty({ default: new GetCurrentDate().getYearMonthDate() })
  foundYear?: Date;

  @IsOptional()
  @IsString()
  @ApiProperty()
  parson?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  viceParson?: string;

  @IsOptional()
  @IsObject()
  @ApiProperty({ type: ContactInstituteDto })
  contacts?: ContactInstituteDto;

  @IsOptional()
  @IsArray()
  @ApiProperty({ type: [FunctionAndTaskInstituteDto] })
  function?: FunctionAndTaskInstituteDto[];

  @IsOptional()
  @IsArray()
  @ApiProperty({ type: [FunctionAndTaskInstituteDto] })
  task?: FunctionAndTaskInstituteDto[];

  @IsOptional()
  @IsArray()
  @ApiProperty()
  attachment?: string[];
}
