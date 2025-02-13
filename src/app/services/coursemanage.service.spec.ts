import { TestBed } from '@angular/core/testing';

import { CoursemanageService } from './coursemanage.service';

describe('CoursemanageService', () => {
  let service: CoursemanageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CoursemanageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
