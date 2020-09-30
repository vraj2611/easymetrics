import { TestBed } from '@angular/core/testing';

import { AnaliseService } from './analise.service';

describe('DadosService', () => {
  let service: AnaliseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnaliseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
