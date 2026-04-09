import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartCamanberImpayeMoisComponent } from './chart-camanber-impaye-mois.component';

describe('ChartCamanberImpayeMoisComponent', () => {
  let component: ChartCamanberImpayeMoisComponent;
  let fixture: ComponentFixture<ChartCamanberImpayeMoisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChartCamanberImpayeMoisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartCamanberImpayeMoisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
