import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostVideoPage } from './post-video.page';

describe('PostVideoPage', () => {
  let component: PostVideoPage;
  let fixture: ComponentFixture<PostVideoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostVideoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostVideoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
