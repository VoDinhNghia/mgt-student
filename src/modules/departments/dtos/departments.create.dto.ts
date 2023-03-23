import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsObject, IsString } from 'class-validator';
import { ContactDepartmentDto } from './department.contact.dto';
import { FunctionAndTaskDepartmentDto } from './department.function-task.dto';

export class CreateDepartmentDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  unitName?: string;

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
  @ApiProperty({ type: ContactDepartmentDto })
  contacts?: ContactDepartmentDto;

  @IsArray()
  @ApiProperty({ type: [FunctionAndTaskDepartmentDto] })
  function?: FunctionAndTaskDepartmentDto[];

  @IsArray()
  @ApiProperty({ type: [FunctionAndTaskDepartmentDto] })
  task?: FunctionAndTaskDepartmentDto[];

  @ApiPropertyOptional({ type: [String] })
  attachment?: string[];
}
