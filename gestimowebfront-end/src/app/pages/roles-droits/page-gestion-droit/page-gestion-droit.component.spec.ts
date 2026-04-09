import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageGestionDroitComponent } from './page-gestion-droit.component';

describe('PageGestionDroitComponent', () => {
  let component: PageGestionDroitComponent;
  let fixture: ComponentFixture<PageGestionDroitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageGestionDroitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageGestionDroitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
