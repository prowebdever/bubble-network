import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoListPage } from './video-list.page';

describe('VideoListPage', () => {
  let component: VideoListPage;
  let fixture: ComponentFixture<VideoListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
