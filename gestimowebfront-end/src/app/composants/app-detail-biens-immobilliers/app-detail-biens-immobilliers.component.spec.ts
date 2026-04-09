import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppDetailBiensImmobilliersComponent } from './app-detail-biens-immobilliers.component';

describe('AppDetailBiensImmobilliersComponent', () => {
  let component: AppDetailBiensImmobilliersComponent;
  let fixture: ComponentFixture<AppDetailBiensImmobilliersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppDetailBiensImmobilliersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppDetailBiensImmobilliersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
