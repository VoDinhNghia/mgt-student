import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CenterService } from './center.service';

@Controller('api/centers')
@ApiTags('centers')
export class CenterController {
  constructor(private readonly service: CenterService) {}
}
