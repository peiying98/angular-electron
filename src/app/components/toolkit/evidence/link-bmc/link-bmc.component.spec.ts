import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkBmcComponent } from './link-bmc.component';

describe('LinkBmcComponent', () => {
  let component: LinkBmcComponent;
  let fixture: ComponentFixture<LinkBmcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkBmcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkBmcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
