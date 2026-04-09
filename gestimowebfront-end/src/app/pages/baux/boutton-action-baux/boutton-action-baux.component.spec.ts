import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BouttonActionBauxComponent } from './boutton-action-baux.component';

describe('BouttonActionBauxComponent', () => {
  let component: BouttonActionBauxComponent;
  let fixture: ComponentFixture<BouttonActionBauxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BouttonActionBauxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BouttonActionBauxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
