import { TestBed } from '@angular/core/testing';

import { UserVideosmanageService } from './user-videosmanage.service';

describe('UserVideosmanageService', () => {
  let service: UserVideosmanageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserVideosmanageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
