import { PartialType } from '@nestjs/swagger';
import { CreateVolunteeProgramDto } from './trainning-point.create.voluntee-program.dto';

export class UpdateVolunteeDto extends PartialType(CreateVolunteeProgramDto) {}
