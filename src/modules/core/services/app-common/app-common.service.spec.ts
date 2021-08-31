import { Test, TestingModule } from '@nestjs/testing';
import { AppCommonService } from './app-common.service';

describe('AppCommonService', () => {
  let service: AppCommonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppCommonService],
    }).compile();

    service = module.get<AppCommonService>(AppCommonService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
