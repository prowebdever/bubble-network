import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainFollowingsPage } from './followings.page';

describe('MainFollowingsPage', () => {
  let component: MainFollowingsPage;
  let fixture: ComponentFixture<MainFollowingsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainFollowingsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainFollowingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
