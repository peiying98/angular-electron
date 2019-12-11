import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BmcComponent } from './bmc.component';

describe('BmcComponent', () => {
  let component: BmcComponent;
  let fixture: ComponentFixture<BmcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BmcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BmcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
