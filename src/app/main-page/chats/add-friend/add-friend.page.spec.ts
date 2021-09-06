import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFriendPage } from './add-friend.page';

describe('AddFriendPage', () => {
  let component: AddFriendPage;
  let fixture: ComponentFixture<AddFriendPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddFriendPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFriendPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
