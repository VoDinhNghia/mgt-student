import { Test, TestingModule } from '@nestjs/testing';
import { ScholarshipController } from './scholarship.controller';

describe('ScholarshipController', () => {
  let controller: ScholarshipController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScholarshipController],
    }).compile();

    controller = module.get<ScholarshipController>(ScholarshipController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
