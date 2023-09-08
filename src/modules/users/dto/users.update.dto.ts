import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './users.create.dto';
import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EstatusUser } from 'src/constants/constant';

export class UsersUpdateDto extends PartialType(CreateUserDto) {
  @IsString()
  @IsOptional()
  @ApiProperty()
  newPassword?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ enum: EstatusUser })
  status?: string;
}
