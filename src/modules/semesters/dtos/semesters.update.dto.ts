import { PartialType } from '@nestjs/swagger';
import { CreateSemesterDto } from './semesters.create.dto';

export class UpdateSemesterDto extends PartialType(CreateSemesterDto) {}
