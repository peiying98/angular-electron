import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingPersonalComponent } from './landing-personal.component';

describe('LandingPersonalComponent', () => {
  let component: LandingPersonalComponent;
  let fixture: ComponentFixture<LandingPersonalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LandingPersonalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingPersonalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
