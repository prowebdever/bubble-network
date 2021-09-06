import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainFollowersPage } from './followers.page';

describe('MainFollowersPage', () => {
  let component: MainFollowersPage;
  let fixture: ComponentFixture<MainFollowersPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainFollowersPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainFollowersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
