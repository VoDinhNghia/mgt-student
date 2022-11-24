import { Test, TestingModule } from '@nestjs/testing';
import { DegreelevelController } from './degreelevel.controller';

describe('DegreelevelController', () => {
  let controller: DegreelevelController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DegreelevelController],
    }).compile();

    controller = module.get<DegreelevelController>(DegreelevelController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
