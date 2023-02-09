import { ApiProperty } from '@nestjs/swagger';
import { LecturerListDto } from './faculties.lecturerList.dto';
export class CreateFacultyDto {
  @ApiProperty({ required: true })
  branch?: string;

  @ApiProperty({ required: true })
  name?: string;

  @ApiProperty()
  introduction?: string;

  @ApiProperty({ required: true, default: '02-2023' })
  foundYear?: string;

  @ApiProperty({ required: false, type: [String] })
  award?: [string];

  @ApiProperty({ required: true, type: [LecturerListDto] })
  lecturerList?: [LecturerListDto];
}
