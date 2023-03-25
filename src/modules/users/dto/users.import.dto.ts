import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UserImportDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  email?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  role?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  gender?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  mobile?: string;

  @IsString()
  @ApiProperty()
  middleName?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  lastName?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  firstName?: string;
}
