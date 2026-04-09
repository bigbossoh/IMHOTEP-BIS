import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageSuperviseurComponent } from './page-superviseur.component';

describe('PageSuperviseurComponent', () => {
  let component: PageSuperviseurComponent;
  let fixture: ComponentFixture<PageSuperviseurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageSuperviseurComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageSuperviseurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
