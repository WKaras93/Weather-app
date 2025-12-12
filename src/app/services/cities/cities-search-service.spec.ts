import { TestBed } from '@angular/core/testing';

import { CitiesSearchService } from './cities-search-service';

describe('CitiesSearchService', () => {
  let service: CitiesSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CitiesSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
