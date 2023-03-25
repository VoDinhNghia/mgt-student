import { PartialType } from '@nestjs/swagger';
import { CreateSubjectDto } from './class-subject.create-subject.dto';

export class UpdateSubjectDto extends PartialType(CreateSubjectDto) {}
