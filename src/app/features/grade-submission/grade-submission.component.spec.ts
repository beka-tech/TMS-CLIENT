import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { GradeService } from '../../services/grade.service';
import { GradeSubmissionComponent } from './grade-submission.component';

describe('GradeSubmissionComponent', () => {
  let component: GradeSubmissionComponent;
  let fixture: ComponentFixture<GradeSubmissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GradeSubmissionComponent],
      providers: [
        {
          provide: GradeService,
          useValue: { postGrade: () => of({ id: 'GRADE-1', success: true }) },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GradeSubmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
