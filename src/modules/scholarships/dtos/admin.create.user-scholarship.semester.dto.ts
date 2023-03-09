import { ApiProperty } from '@nestjs/swagger';

export class CreateUserScholarshipInSemester {
  @ApiProperty({ required: true })
  semester: string;
}
