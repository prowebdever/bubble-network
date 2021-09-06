import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SponsorAdPage } from './sponsor-ad.page';

describe('SponsorAdPage', () => {
  let component: SponsorAdPage;
  let fixture: ComponentFixture<SponsorAdPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SponsorAdPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SponsorAdPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
