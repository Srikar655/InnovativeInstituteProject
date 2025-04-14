import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideosDisplayComponent } from './videos-display.component';

describe('VideosDisplayComponent', () => {
  let component: VideosDisplayComponent;
  let fixture: ComponentFixture<VideosDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideosDisplayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideosDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
