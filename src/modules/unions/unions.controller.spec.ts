import { Test, TestingModule } from '@nestjs/testing';
import { UnionsController } from './unions.controller';

describe('UnionsController', () => {
  let controller: UnionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UnionsController],
    }).compile();

    controller = module.get<UnionsController>(UnionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
