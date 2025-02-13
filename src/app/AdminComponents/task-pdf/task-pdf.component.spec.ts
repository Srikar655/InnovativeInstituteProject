import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskPdfComponent } from './task-pdf.component';

describe('TaskPdfComponent', () => {
  let component: TaskPdfComponent;
  let fixture: ComponentFixture<TaskPdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskPdfComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
