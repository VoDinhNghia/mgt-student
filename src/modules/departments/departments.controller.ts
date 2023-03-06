import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DepartmentsService } from './departments.service';

@Controller('api/departments')
@ApiTags('departments')
export class DepartmentsController {
  constructor(private readonly service: DepartmentsService) {}
}
