import { ApiProperty } from '@nestjs/swagger';
import { ContactDepartmentDto } from './department.contact.dto';
import { FunctionAndTaskDepartmentDto } from './department.function-task.dto';

export class CreateDepartmentDto {
  @ApiProperty({ required: true })
  unitName?: string;

  @ApiProperty({ required: true })
  introduction?: string;

  @ApiProperty({ required: true })
  foundYear?: string;

  @ApiProperty({ required: true })
  manager?: string;

  @ApiProperty({ type: ContactDepartmentDto, required: true })
  contacts?: ContactDepartmentDto;

  @ApiProperty({ required: true, type: [FunctionAndTaskDepartmentDto] })
  function?: FunctionAndTaskDepartmentDto[];

  @ApiProperty({ required: true, type: [FunctionAndTaskDepartmentDto] })
  task?: FunctionAndTaskDepartmentDto[];

  @ApiProperty({ required: false })
  attachment?: string[];
}
