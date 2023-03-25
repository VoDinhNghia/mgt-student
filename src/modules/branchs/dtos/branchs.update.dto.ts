import { PartialType } from '@nestjs/swagger';
import { BranchCreateDto } from './branchs.create.dto';

export class BranchUpdateDto extends PartialType(BranchCreateDto) {}
