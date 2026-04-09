import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TachesPlanifieesComponent } from './taches-planifiees.component';

describe('TachesPlanifieesComponent', () => {
  let component: TachesPlanifieesComponent;
  let fixture: ComponentFixture<TachesPlanifieesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TachesPlanifieesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TachesPlanifieesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
