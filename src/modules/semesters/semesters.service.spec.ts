import { Test, TestingModule } from '@nestjs/testing';
import { SemestersService } from './semesters.service';

describe('SemestersService', () => {
  let service: SemestersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SemestersService],
    }).compile();

    service = module.get<SemestersService>(SemestersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
