import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGroupPage } from './add-group.page';

describe('AddGroupPage', () => {
  let component: AddGroupPage;
  let fixture: ComponentFixture<AddGroupPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddGroupPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddGroupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
