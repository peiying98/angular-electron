import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolkitLoginComponent } from './toolkit-login.component';

describe('ToolkitLoginComponent', () => {
  let component: ToolkitLoginComponent;
  let fixture: ComponentFixture<ToolkitLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToolkitLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolkitLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
