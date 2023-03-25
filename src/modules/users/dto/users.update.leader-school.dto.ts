import { PartialType } from '@nestjs/swagger';
import { CreateLeaderSchoolDto } from './users.create.leader-school.dto';

export class UpdateLeaderSchoolDto extends PartialType(CreateLeaderSchoolDto) {}
