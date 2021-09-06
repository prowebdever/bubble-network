import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainContainerPage } from './main-container.page';

describe('MainContainerPage', () => {
  let component: MainContainerPage;
  let fixture: ComponentFixture<MainContainerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainContainerPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainContainerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
