import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GainpainratioComponent } from './gainpainratio.component';

describe('GainpainratioComponent', () => {
  let component: GainpainratioComponent;
  let fixture: ComponentFixture<GainpainratioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GainpainratioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GainpainratioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
