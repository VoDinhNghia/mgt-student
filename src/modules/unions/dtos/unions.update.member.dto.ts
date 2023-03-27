import { PartialType } from '@nestjs/swagger';
import { CreateUnionMemberDto } from './unions.create.member.dto';

export class UpdateUnionMember extends PartialType(CreateUnionMemberDto) {}
