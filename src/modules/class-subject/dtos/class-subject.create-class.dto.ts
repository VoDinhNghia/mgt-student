import { ApiProperty } from '@nestjs/swagger';

export class CreateClassDto {
  @ApiProperty({ required: true })
  course?: string;

  @ApiProperty({ required: true })
  name?: string;

  @ApiProperty({ required: true })
  degreeLevel?: string;

  @ApiProperty({ required: true, default: 50 })
  classSize?: number;

  @ApiProperty({ required: true })
  major?: string;

  @ApiProperty({ required: false })
  homeroomteacher?: string;
}
