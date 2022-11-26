import { Test, TestingModule } from '@nestjs/testing';
import { SemestersController } from './semesters.controller';

describe('SemestersController', () => {
  let controller: SemestersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SemestersController],
    }).compile();

    controller = module.get<SemestersController>(SemestersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
