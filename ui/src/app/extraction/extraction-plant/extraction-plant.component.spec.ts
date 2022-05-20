import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtractionPlantComponent } from './extraction-plant.component';

describe('ExtractionPlantComponent', () => {
  let component: ExtractionPlantComponent;
  let fixture: ComponentFixture<ExtractionPlantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExtractionPlantComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtractionPlantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
