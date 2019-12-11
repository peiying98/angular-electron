import { TestBed, inject } from '@angular/core/testing';

import { PitchsubmittednotificationService } from './pitchsubmittednotification.service';

describe('PitchsubmittednotificationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PitchsubmittednotificationService]
    });
  });

  it('should be created', inject([PitchsubmittednotificationService], (service: PitchsubmittednotificationService) => {
    expect(service).toBeTruthy();
  }));
});
