import { Controller } from '@nestjs/common';
import { StudyProcessService } from './study-process.service';
import { studyProcessController } from 'src/constants/constants.controller.name-tag';
import { ApiTags } from '@nestjs/swagger';

@Controller(studyProcessController.name)
@ApiTags(studyProcessController.tag)
export class StudyProcessController {
  constructor(private readonly service: StudyProcessService) {}
}
