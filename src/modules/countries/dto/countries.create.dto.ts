import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCoutriesDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  flag?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  countryId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  capital: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  status?: string;
}
