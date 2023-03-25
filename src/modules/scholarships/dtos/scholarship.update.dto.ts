import { PartialType } from '@nestjs/swagger';
import { CreateScholarshipDto } from './scholarship.create.dto';

export class UpdateScholarshipDto extends PartialType(CreateScholarshipDto) {}
