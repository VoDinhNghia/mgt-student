import { PartialType } from '@nestjs/swagger';
import { CreateDepartmentDto } from './departments.create.dto';

export class UpdateDepartmentDto extends PartialType(CreateDepartmentDto) {}
