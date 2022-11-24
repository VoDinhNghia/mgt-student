import { Test, TestingModule } from '@nestjs/testing';
import { UnionsService } from './unions.service';

describe('UnionsService', () => {
  let service: UnionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UnionsService],
    }).compile();

    service = module.get<UnionsService>(UnionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
