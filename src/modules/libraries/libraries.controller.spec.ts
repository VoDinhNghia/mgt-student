import { Test, TestingModule } from '@nestjs/testing';
import { LibrariesController } from './libraries.controller';

describe('LibrariesController', () => {
  let controller: LibrariesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LibrariesController],
    }).compile();

    controller = module.get<LibrariesController>(LibrariesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
