import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradeSubmissionComponent } from './grade-submission.component';

describe('GradeSubmissionComponent', () => {
  let component: GradeSubmissionComponent;
  let fixture: ComponentFixture<GradeSubmissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GradeSubmissionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GradeSubmissionComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
