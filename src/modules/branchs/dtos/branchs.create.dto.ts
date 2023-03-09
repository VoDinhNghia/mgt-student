import { ApiProperty } from '@nestjs/swagger';
import { BranchContactInfoDto } from './branchs.contact-info.dto';
import { BranchLocationDto } from './branchs.location.dto';

export class BranchCreateDto {
  @ApiProperty({ required: true })
  title?: string;

  @ApiProperty({ required: true })
  name?: string;

  @ApiProperty()
  description?: string;

  @ApiProperty()
  website?: string;

  @ApiProperty({ type: BranchLocationDto, required: true })
  location?: BranchLocationDto;

  @ApiProperty({ required: true, type: [BranchContactInfoDto] })
  contactInfo?: [BranchContactInfoDto];
}
