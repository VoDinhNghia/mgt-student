import { PartialType } from '@nestjs/swagger';
import { CreateFacultyDto } from './faculties.create.dto';

export class UpdateFacultyDto extends PartialType(CreateFacultyDto) {}
