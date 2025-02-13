import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorialVediosComponent } from './tutorial-vedios.component';

describe('TutorialVediosComponent', () => {
  let component: TutorialVediosComponent;
  let fixture: ComponentFixture<TutorialVediosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TutorialVediosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TutorialVediosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
