import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NothingFoundComponent } from './nothing-found.component';

describe('NothingFoundComponent', () => {
  let component: NothingFoundComponent;
  let fixture: ComponentFixture<NothingFoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NothingFoundComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NothingFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
