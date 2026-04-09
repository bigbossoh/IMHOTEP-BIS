import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonNewUserActionComponent } from './button-new-user-action.component';

describe('ButtonNewUserActionComponent', () => {
  let component: ButtonNewUserActionComponent;
  let fixture: ComponentFixture<ButtonNewUserActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ButtonNewUserActionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonNewUserActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
