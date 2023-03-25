import { PartialType } from '@nestjs/swagger';
import { CreateClassDto } from './class-subject.create-class.dto';

export class UpdateClassDto extends PartialType(CreateClassDto) {}
