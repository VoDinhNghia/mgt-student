import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './users.create.dto';
import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UsersUpdateDto extends PartialType(CreateUserDto) {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  newPassword?: string;
}
