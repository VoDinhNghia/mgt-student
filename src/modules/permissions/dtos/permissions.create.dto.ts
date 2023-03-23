import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { Epermission } from 'src/constants/constant';

export class CreatePermissionDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  user?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  moduleName?: string;

  @IsArray()
  @ApiProperty({ default: [Epermission.ONLY_VIEW] })
  permission?: string[];
}
