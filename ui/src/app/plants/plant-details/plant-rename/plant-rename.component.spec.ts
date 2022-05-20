import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantRenameComponent } from './plant-rename.component';

describe('PlantRenameComponent', () => {
  let component: PlantRenameComponent;
  let fixture: ComponentFixture<PlantRenameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlantRenameComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlantRenameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
