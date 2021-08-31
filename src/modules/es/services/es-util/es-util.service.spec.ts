import { Test, TestingModule } from '@nestjs/testing';
import { EsUtilService } from './es-util.service';

describe('EsUtilService', () => {
  let service: EsUtilService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EsUtilService],
    }).compile();

    service = module.get<EsUtilService>(EsUtilService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
