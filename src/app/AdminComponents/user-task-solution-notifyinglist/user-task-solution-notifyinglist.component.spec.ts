import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTaskSolutionNotifyinglistComponent } from './user-task-solution-notifyinglist.component';

describe('UserTaskSolutionNotifyinglistComponent', () => {
  let component: UserTaskSolutionNotifyinglistComponent;
  let fixture: ComponentFixture<UserTaskSolutionNotifyinglistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserTaskSolutionNotifyinglistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserTaskSolutionNotifyinglistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
