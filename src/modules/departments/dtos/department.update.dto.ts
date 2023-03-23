import { ApiPropertyOptional } from '@nestjs/swagger';
import { ContactDepartmentDto } from './department.contact.dto';
import { FunctionAndTaskDepartmentDto } from './department.function-task.dto';

export class UpdateDepartmentDto {
  @ApiPropertyOptional()
  unitName?: string;

  @ApiPropertyOptional()
  introduction?: string;

  @ApiPropertyOptional()
  foundYear?: string;

  @ApiPropertyOptional()
  manager?: string;

  @ApiPropertyOptional({ type: ContactDepartmentDto })
  contacts?: ContactDepartmentDto;

  @ApiPropertyOptional({ type: [FunctionAndTaskDepartmentDto] })
  function?: FunctionAndTaskDepartmentDto[];

  @ApiPropertyOptional({ type: [FunctionAndTaskDepartmentDto] })
  task?: FunctionAndTaskDepartmentDto[];

  @ApiPropertyOptional({ type: [String] })
  attachment?: string[];
}
