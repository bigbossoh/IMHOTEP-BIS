import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelanceAppelsComponent } from './relance-appels.component';

describe('RelanceAppelsComponent', () => {
  let component: RelanceAppelsComponent;
  let fixture: ComponentFixture<RelanceAppelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RelanceAppelsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RelanceAppelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
