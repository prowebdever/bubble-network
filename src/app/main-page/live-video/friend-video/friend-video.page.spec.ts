import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendVideoPage } from './friend-video.page';

describe('FriendVideoPage', () => {
  let component: FriendVideoPage;
  let fixture: ComponentFixture<FriendVideoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FriendVideoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FriendVideoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
