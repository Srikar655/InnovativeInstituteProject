import { TestBed } from '@angular/core/testing';

import { UsertaskService } from './usertask.service';

describe('UsertaskService', () => {
  let service: UsertaskService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsertaskService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
