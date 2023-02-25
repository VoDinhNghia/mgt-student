import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SchoolService } from './school.service';

@Controller('schools')
@ApiTags('schools')
export class SchoolController {
  constructor(private readonly schoolService: SchoolService) {}
}
