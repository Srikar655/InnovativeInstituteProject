import { TestBed } from '@angular/core/testing';

import { TaskscrudService } from './taskscrud.service';

describe('TaskscrudService', () => {
  let service: TaskscrudService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskscrudService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
