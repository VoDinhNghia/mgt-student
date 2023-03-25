import { PartialType } from '@nestjs/swagger';
import { CreateMajorDto } from './faculties.major.create.dto';

export class UpdateMajorDto extends PartialType(CreateMajorDto) {}
