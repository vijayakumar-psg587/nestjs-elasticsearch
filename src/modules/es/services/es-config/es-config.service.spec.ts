import { Test, TestingModule } from '@nestjs/testing';
import { EsConfigService } from './es-config.service';

describe('EsConfigService', () => {
  let service: EsConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EsConfigService],
    }).compile();

    service = module.get<EsConfigService>(EsConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
