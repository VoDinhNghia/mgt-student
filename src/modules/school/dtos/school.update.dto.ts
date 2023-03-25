import { PartialType } from '@nestjs/swagger';
import { CreateSchoolDto } from './school.create.dto';

export class UpdateSchoolDto extends PartialType(CreateSchoolDto) {}
