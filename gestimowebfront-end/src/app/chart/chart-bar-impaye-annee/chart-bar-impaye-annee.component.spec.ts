import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartBarImpayeAnneeComponent } from './chart-bar-impaye-annee.component';

describe('ChartBarImpayeAnneeComponent', () => {
  let component: ChartBarImpayeAnneeComponent;
  let fixture: ComponentFixture<ChartBarImpayeAnneeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChartBarImpayeAnneeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartBarImpayeAnneeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
