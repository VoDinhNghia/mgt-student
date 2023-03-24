import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';
import { Epermission } from 'src/constants/constant';

export class UpdatePermissionDto {
  @IsOptional()
  @IsString()
  @ApiProperty()
  moduleName?: string;

  @IsOptional()
  @IsArray()
  @ApiProperty({ default: [Epermission.ONLY_VIEW] })
  permission?: string[];
}
