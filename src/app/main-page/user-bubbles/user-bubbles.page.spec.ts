import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserBubblesPage } from './user-bubbles.page';

describe('UserBubblesPage', () => {
  let component: UserBubblesPage;
  let fixture: ComponentFixture<UserBubblesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserBubblesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserBubblesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
