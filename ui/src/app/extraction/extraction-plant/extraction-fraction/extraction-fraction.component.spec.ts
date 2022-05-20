import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtractionFractionComponent } from './extraction-fraction.component';

describe('ExtractionFractionComponent', () => {
  let component: ExtractionFractionComponent;
  let fixture: ComponentFixture<ExtractionFractionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExtractionFractionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtractionFractionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
