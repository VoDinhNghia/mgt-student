import { Test, TestingModule } from '@nestjs/testing';
import { DegreelevelService } from './degreelevel.service';

describe('DegreelevelService', () => {
  let service: DegreelevelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DegreelevelService],
    }).compile();

    service = module.get<DegreelevelService>(DegreelevelService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
