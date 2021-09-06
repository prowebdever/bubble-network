import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveVideoPage } from './live-video.page';

describe('LiveVideoPage', () => {
  let component: LiveVideoPage;
  let fixture: ComponentFixture<LiveVideoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiveVideoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveVideoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
