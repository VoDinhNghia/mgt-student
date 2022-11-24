import { Test, TestingModule } from '@nestjs/testing';
import { ClassSubjectController } from './class-subject.controller';

describe('ClassSubjectController', () => {
  let controller: ClassSubjectController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClassSubjectController],
    }).compile();

    controller = module.get<ClassSubjectController>(ClassSubjectController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
