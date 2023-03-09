import { ApiProperty } from '@nestjs/swagger';
import { Epermission } from 'src/constants/constant';

export class UpdatePermissionDto {
  @ApiProperty({ required: false })
  moduleName?: string;

  @ApiProperty({ required: false, default: [Epermission.ONLY_VIEW] })
  permission?: string[];
}
