import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PgaComponent } from './pga.component';

describe('PgaComponent', () => {
  let component: PgaComponent;
  let fixture: ComponentFixture<PgaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PgaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PgaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
