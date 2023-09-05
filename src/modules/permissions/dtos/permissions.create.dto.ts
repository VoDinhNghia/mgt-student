import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
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
  @IsOptional()
  @ApiPropertyOptional({ default: [Epermission.ONLY_VIEW] })
  permission?: string[];
}
