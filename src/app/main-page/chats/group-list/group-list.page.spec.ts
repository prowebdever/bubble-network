import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupListPage } from './group-list.page';

describe('GroupListPage', () => {
  let component: GroupListPage;
  let fixture: ComponentFixture<GroupListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
