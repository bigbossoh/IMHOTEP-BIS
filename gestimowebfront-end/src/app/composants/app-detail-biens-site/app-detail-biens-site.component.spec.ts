import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppDetailBiensSiteComponent } from './app-detail-biens-site.component';

describe('AppDetailBiensSiteComponent', () => {
  let component: AppDetailBiensSiteComponent;
  let fixture: ComponentFixture<AppDetailBiensSiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppDetailBiensSiteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppDetailBiensSiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
