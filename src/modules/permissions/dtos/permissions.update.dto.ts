import { PartialType } from '@nestjs/swagger';
import { CreatePermissionDto } from './permissions.create.dto';

export class UpdatePermissionDto extends PartialType(CreatePermissionDto) {}
