import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './users.create.dto';

export class UsersUpdateDto extends PartialType(CreateUserDto) {}
