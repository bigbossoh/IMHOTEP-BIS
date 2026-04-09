import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageProprietaireComponent } from './page-proprietaire.component';

describe('PageProprietaireComponent', () => {
  let component: PageProprietaireComponent;
  let fixture: ComponentFixture<PageProprietaireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageProprietaireComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageProprietaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
