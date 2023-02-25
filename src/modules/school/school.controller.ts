import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SchoolService } from './school.service';

@Controller('school')
@ApiTags('school')
export class SchoolController {
  constructor(private readonly schoolService: SchoolService) {
    const schoolDto = {
      name: 'Dai Hoc Cong Nghiep TP. HCM',
      schoolCode: 'IUH',
      numberTotal: 40000,
      yearFound: '2023-02-25',
      contactInfo: {
        email: 'iuh@gmail.com',
        fax: '',
        mobile: '0393993939',
      },
    };
    this.schoolService.createSchool(schoolDto);
  }
}
