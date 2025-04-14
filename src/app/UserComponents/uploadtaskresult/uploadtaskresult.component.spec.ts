import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadtaskresultComponent } from './uploadtaskresult.component';

describe('UploadtaskresultComponent', () => {
  let component: UploadtaskresultComponent;
  let fixture: ComponentFixture<UploadtaskresultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadtaskresultComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadtaskresultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
