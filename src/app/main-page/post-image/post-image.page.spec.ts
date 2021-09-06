import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostImagePage } from './post-image.page';

describe('PostImagePage', () => {
  let component: PostImagePage;
  let fixture: ComponentFixture<PostImagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostImagePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostImagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
