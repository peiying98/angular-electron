import { TestBed, inject } from '@angular/core/testing';

import { PaasService } from './paas.service';

describe('PaasService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PaasService]
    });
  });

  it('should be created', inject([PaasService], (service: PaasService) => {
    expect(service).toBeTruthy();
  }));
});
