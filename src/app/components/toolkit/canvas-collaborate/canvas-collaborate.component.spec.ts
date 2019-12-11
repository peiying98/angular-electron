import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CanvasCollaborateComponent } from './canvas-collaborate.component';

describe('CanvasCollaborateComponent', () => {
  let component: CanvasCollaborateComponent;
  let fixture: ComponentFixture<CanvasCollaborateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CanvasCollaborateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CanvasCollaborateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
