import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingEmailCardComponent } from './landing-email-card.component';

describe('LandingEmailCardComponent', () => {
  let component: LandingEmailCardComponent;
  let fixture: ComponentFixture<LandingEmailCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LandingEmailCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingEmailCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
