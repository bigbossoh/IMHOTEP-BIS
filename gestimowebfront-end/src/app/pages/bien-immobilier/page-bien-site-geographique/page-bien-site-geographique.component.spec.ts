import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageBienSiteGeographiqueComponent } from './page-bien-site-geographique.component';

describe('PageBienSiteGeographiqueComponent', () => {
  let component: PageBienSiteGeographiqueComponent;
  let fixture: ComponentFixture<PageBienSiteGeographiqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageBienSiteGeographiqueComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageBienSiteGeographiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
