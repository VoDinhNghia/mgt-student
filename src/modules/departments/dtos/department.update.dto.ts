import { ApiProperty } from '@nestjs/swagger';
import { ContactDepartmentDto } from './department.contact.dto';
import { FunctionAndTaskDepartmentDto } from './department.function-task.dto';

export class UpdateDepartmentDto {
  @ApiProperty({ required: false })
  unitName?: string;

  @ApiProperty({ required: false })
  introduction?: string;

  @ApiProperty({ required: false })
  foundYear?: string;

  @ApiProperty({ required: false })
  manager?: string;

  @ApiProperty({ type: ContactDepartmentDto, required: false })
  contacts?: ContactDepartmentDto;

  @ApiProperty({ required: false, type: [FunctionAndTaskDepartmentDto] })
  function?: FunctionAndTaskDepartmentDto[];

  @ApiProperty({ required: false, type: [FunctionAndTaskDepartmentDto] })
  task?: FunctionAndTaskDepartmentDto[];

  @ApiProperty({ required: false })
  attachment?: string[];
}
