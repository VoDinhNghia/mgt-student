import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class OrganizingCommitteeDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  leader?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  secretary?: string;
}
