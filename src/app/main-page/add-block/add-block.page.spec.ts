import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBlockPage } from './add-block.page';

describe('AddBlockPage', () => {
  let component: AddBlockPage;
  let fixture: ComponentFixture<AddBlockPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddBlockPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBlockPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
