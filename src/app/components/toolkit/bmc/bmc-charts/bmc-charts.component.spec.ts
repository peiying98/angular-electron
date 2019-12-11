import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BmcChartsComponent } from './bmc-charts.component';

describe('BmcChartsComponent', () => {
  let component: BmcChartsComponent;
  let fixture: ComponentFixture<BmcChartsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BmcChartsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BmcChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
