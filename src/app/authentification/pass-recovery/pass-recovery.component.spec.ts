import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PassRecoveryComponent } from './pass-recovery.component';

describe('PassRecoveryComponent', () => {
  let component: PassRecoveryComponent;
  let fixture: ComponentFixture<PassRecoveryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PassRecoveryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PassRecoveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
