import { TestBed, inject } from '@angular/core/testing';

import { UserDataService } from './user-data.service';

describe('UserDataServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserDataService]
    });
  });

  it('should be created', inject([UserDataService], (service: UserDataService) => {
    expect(service).toBeTruthy();
  }));
});
