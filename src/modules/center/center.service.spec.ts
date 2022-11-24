import { Test, TestingModule } from '@nestjs/testing';
import { CenterService } from './center.service';

describe('CenterService', () => {
  let service: CenterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CenterService],
    }).compile();

    service = module.get<CenterService>(CenterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
