import { TestBed } from '@angular/core/testing';

import { CoursecrudService } from './videomanagement.service';

describe('CoursecrudService', () => {
  let service: CoursecrudService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CoursecrudService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
