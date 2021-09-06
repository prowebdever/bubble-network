import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BubblesContainerComponent } from './bubbles-container.component';

describe('BubblesContainerComponent', () => {
  let component: BubblesContainerComponent;
  let fixture: ComponentFixture<BubblesContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BubblesContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BubblesContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
