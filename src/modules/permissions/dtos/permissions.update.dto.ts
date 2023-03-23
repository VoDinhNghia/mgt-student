import { ApiPropertyOptional } from '@nestjs/swagger';
import { Epermission } from 'src/constants/constant';

export class UpdatePermissionDto {
  @ApiPropertyOptional()
  moduleName?: string;

  @ApiPropertyOptional({ default: [Epermission.ONLY_VIEW] })
  permission?: string[];
}
