import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeBubblesPage } from './change-bubbles.page';

describe('ChangeBubblesPage', () => {
  let component: ChangeBubblesPage;
  let fixture: ComponentFixture<ChangeBubblesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeBubblesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeBubblesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
