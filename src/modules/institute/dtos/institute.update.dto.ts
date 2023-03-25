import { PartialType } from '@nestjs/swagger';
import { CreateInstituteDto } from './institute.create.dto';

export class UpdateInstituteDto extends PartialType(CreateInstituteDto) {}
