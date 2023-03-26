import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsDate,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { GetCurrentDate } from 'src/utils/utils.get.current-date';
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

  @IsDate()
  @Type(() => Date)
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
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ContactInstituteDto)
  @ApiProperty()
  contacts?: ContactInstituteDto;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => FunctionAndTaskInstituteDto)
  @ApiProperty({ type: [FunctionAndTaskInstituteDto] })
  function?: FunctionAndTaskInstituteDto[];

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => FunctionAndTaskInstituteDto)
  @ApiProperty({ type: [FunctionAndTaskInstituteDto] })
  task?: FunctionAndTaskInstituteDto[];

  @IsOptional()
  @IsArray()
  @ApiProperty({ type: [String] })
  attachment?: string[];
}
