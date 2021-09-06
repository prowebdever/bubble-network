import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendbubblePage } from './friendbubble.page';

describe('ActivityPage', () => {
  let component: FriendbubblePage;
  let fixture: ComponentFixture<FriendbubblePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FriendbubblePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FriendbubblePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
