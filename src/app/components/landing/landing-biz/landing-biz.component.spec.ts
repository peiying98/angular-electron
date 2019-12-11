import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingBizComponent } from './landing-biz.component';

describe('LandingBizComponent', () => {
  let component: LandingBizComponent;
  let fixture: ComponentFixture<LandingBizComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LandingBizComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingBizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

