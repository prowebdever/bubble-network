import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserFollowingPage } from './user-following.page';

describe('UserFollowingPage', () => {
  let component: UserFollowingPage;
  let fixture: ComponentFixture<UserFollowingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserFollowingPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserFollowingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
