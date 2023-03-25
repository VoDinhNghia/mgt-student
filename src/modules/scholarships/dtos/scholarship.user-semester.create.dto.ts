import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserScholarshipInSemester {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  semester: string;
}
