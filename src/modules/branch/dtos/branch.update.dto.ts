import { ApiProperty } from '@nestjs/swagger';
import { BranchUpdateContactInfoDto } from './branch.update-contact-info.dto';
import { BranchUpdateLocationDto } from './branch.update-location.dto';

export class BranchUpdateDto {
  @ApiProperty({ required: false })
  title?: string;

  @ApiProperty({ required: false })
  name?: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ required: false })
  website?: string;

  @ApiProperty({ type: BranchUpdateLocationDto, required: false })
  location?: BranchUpdateLocationDto;

  @ApiProperty({ required: false, type: [BranchUpdateContactInfoDto] })
  contactInfo?: [BranchUpdateContactInfoDto];
}
