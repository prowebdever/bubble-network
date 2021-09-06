import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveVideoBadgeComponent } from './live-video-badge.component';

describe('LiveVideoBadgeComponent', () => {
  let component: LiveVideoBadgeComponent;
  let fixture: ComponentFixture<LiveVideoBadgeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiveVideoBadgeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveVideoBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
