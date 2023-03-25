import { PartialType } from '@nestjs/swagger';
import { CreateStaffDepartmentDto } from './department.staff.create.dto';

export class UpdateStaffDepartmentDto extends PartialType(
  CreateStaffDepartmentDto,
) {}
