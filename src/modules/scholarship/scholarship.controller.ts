import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ScholarshipService } from './scholarship.service';

@Controller('scholarships')
@ApiTags('scholarships')
export class ScholarshipController {
  constructor(private readonly service: ScholarshipService) {}
}
