import { PartialType } from '@nestjs/mapped-types';
import { UserProfileDto } from './users.create-profile.dto';

export class UpdateProfileDto extends PartialType(UserProfileDto) {}
