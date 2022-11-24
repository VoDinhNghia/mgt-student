import { Test, TestingModule } from '@nestjs/testing';
import { CenterController } from './center.controller';

describe('CenterController', () => {
  let controller: CenterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CenterController],
    }).compile();

    controller = module.get<CenterController>(CenterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
