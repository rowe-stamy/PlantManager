import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtractionsTableComponent } from './extractions-table.component';

describe('ExtractionsTableComponent', () => {
  let component: ExtractionsTableComponent;
  let fixture: ComponentFixture<ExtractionsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExtractionsTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtractionsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
