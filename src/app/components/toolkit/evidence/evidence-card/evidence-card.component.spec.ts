import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EvidenceCardComponent } from './evidence-card.component';

describe('EvidenceCardComponent', () => {
  let component: EvidenceCardComponent;
  let fixture: ComponentFixture<EvidenceCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EvidenceCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvidenceCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
