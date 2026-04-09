import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppDetailBailComponent } from './app-detail-bail.component';

describe('AppDetailBailComponent', () => {
  let component: AppDetailBailComponent;
  let fixture: ComponentFixture<AppDetailBailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppDetailBailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppDetailBailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
