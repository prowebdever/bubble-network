import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBubblePage } from './edit-bubble.page';

describe('EditBubblePage', () => {
  let component: EditBubblePage;
  let fixture: ComponentFixture<EditBubblePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditBubblePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditBubblePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
