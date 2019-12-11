import { TestBed, inject } from '@angular/core/testing';

import { IdeaDataService } from './idea-data.service';

describe('IdeaDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IdeaDataService]
    });
  });

  it('should be created', inject([IdeaDataService], (service: IdeaDataService) => {
    expect(service).toBeTruthy();
  }));
});
