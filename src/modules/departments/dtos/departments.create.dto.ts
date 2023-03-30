import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ContactDepartmentDto } from './department.contact.dto';
import { FunctionAndTaskDepartmentDto } from './department.function-task.dto';

export class CreateDepartmentDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  introduction?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  foundYear?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  manager?: string;

  @IsObject()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ContactDepartmentDto)
  @ApiProperty()
  contacts?: ContactDepartmentDto;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => FunctionAndTaskDepartmentDto)
  @ApiProperty({ type: [FunctionAndTaskDepartmentDto] })
  function?: FunctionAndTaskDepartmentDto[];

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => FunctionAndTaskDepartmentDto)
  @ApiProperty({ type: [FunctionAndTaskDepartmentDto] })
  task?: FunctionAndTaskDepartmentDto[];

  @IsOptional()
  @IsArray()
  @ApiProperty({ type: [String] })
  attachment?: string[];
}
