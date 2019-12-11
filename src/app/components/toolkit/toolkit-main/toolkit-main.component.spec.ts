import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolkitMainComponent } from './toolkit-main.component';

describe('ToolkitMainComponent', () => {
  let component: ToolkitMainComponent;
  let fixture: ComponentFixture<ToolkitMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToolkitMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolkitMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
