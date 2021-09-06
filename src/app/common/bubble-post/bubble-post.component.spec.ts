import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BubblePostComponent } from './bubble-post.component';

describe('BubblePostComponent', () => {
  let component: BubblePostComponent;
  let fixture: ComponentFixture<BubblePostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BubblePostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BubblePostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
