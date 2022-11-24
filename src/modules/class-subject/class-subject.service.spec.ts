import { Test, TestingModule } from '@nestjs/testing';
import { ClassSubjectService } from './class-subject.service';

describe('ClassSubjectService', () => {
  let service: ClassSubjectService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClassSubjectService],
    }).compile();

    service = module.get<ClassSubjectService>(ClassSubjectService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
