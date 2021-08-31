import { Test, TestingModule } from '@nestjs/testing';
import { EsCrudService } from './es-crud.service';

describe('EsCrudService', () => {
  let service: EsCrudService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EsCrudService],
    }).compile();

    service = module.get<EsCrudService>(EsCrudService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
