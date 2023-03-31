import { Controller } from '@nestjs/common';
import { TrainningPointService } from './trainning-point.service';
import { trainningPointController } from 'src/constants/constants.controller.name-tag';
import { ApiTags } from '@nestjs/swagger';

@Controller(trainningPointController.name)
@ApiTags(trainningPointController.tag)
export class TrainningPointController {
  constructor(private readonly service: TrainningPointService) {}
}
