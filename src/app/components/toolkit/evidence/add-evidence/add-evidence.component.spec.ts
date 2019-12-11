import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEvidenceComponent } from './add-evidence.component';

describe('AddEvidenceComponent', () => {
  let component: AddEvidenceComponent;
  let fixture: ComponentFixture<AddEvidenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEvidenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEvidenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
