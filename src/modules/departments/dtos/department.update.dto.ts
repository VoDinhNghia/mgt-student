import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsObject, IsOptional, IsString } from 'class-validator';
import { ContactDepartmentDto } from './department.contact.dto';
import { FunctionAndTaskDepartmentDto } from './department.function-task.dto';

export class UpdateDepartmentDto {
  @IsOptional()
  @IsString()
  @ApiProperty()
  unitName?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  introduction?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  foundYear?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  manager?: string;

  @IsOptional()
  @IsObject()
  @ApiProperty({ type: ContactDepartmentDto })
  contacts?: ContactDepartmentDto;

  @IsOptional()
  @IsArray()
  @ApiProperty({ type: [FunctionAndTaskDepartmentDto] })
  function?: FunctionAndTaskDepartmentDto[];

  @IsOptional()
  @IsArray()
  @ApiProperty({ type: [FunctionAndTaskDepartmentDto] })
  task?: FunctionAndTaskDepartmentDto[];

  @IsOptional()
  @IsArray()
  @ApiProperty({ type: [String] })
  attachment?: string[];
}
