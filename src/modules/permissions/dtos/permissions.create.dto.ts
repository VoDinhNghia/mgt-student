import { ApiProperty } from '@nestjs/swagger';
import { Epermission } from 'src/constants/constant';

export class CreatePermissionDto {
  @ApiProperty({ required: true })
  user?: string;

  @ApiProperty({ required: true })
  moduleName?: string;

  @ApiProperty({ required: true, default: [Epermission.ONLY_VIEW] })
  permission?: string[];
}
