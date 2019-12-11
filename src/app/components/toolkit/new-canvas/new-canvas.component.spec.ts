import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCanvasComponent } from './new-canvas.component';

describe('NewCanvasComponent', () => {
  let component: NewCanvasComponent;
  let fixture: ComponentFixture<NewCanvasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewCanvasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
