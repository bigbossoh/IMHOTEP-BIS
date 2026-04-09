import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageGrandCompteComponent } from './page-grand-compte.component';

describe('PageGrandCompteComponent', () => {
  let component: PageGrandCompteComponent;
  let fixture: ComponentFixture<PageGrandCompteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageGrandCompteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageGrandCompteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
