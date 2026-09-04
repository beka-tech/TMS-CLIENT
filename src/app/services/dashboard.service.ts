import { Injectable, inject } from '@angular/core';
import { Observable, forkJoin, map } from 'rxjs';
import { DashboardSummary, EnrollmentRecord, Student, TrainingCourse } from '../models/tms.model';
import { CourseService } from './course.service';
import { EnrollmentService } from './enrollment';
import { StudentService } from './student.service';

export interface DashboardData {
  students: Student[];
  courses: TrainingCourse[];
  enrollments: EnrollmentRecord[];
  summary: DashboardSummary;
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly students = inject(StudentService);
  private readonly courses = inject(CourseService);
  private readonly enrollments = inject(EnrollmentService);

  getData(): Observable<DashboardData> {
    return forkJoin({
      students: this.students.getAll(),
      courses: this.courses.getAll(),
      enrollments: this.enrollments.getAll(),
    }).pipe(
      map((data) => ({
        ...data,
        summary: {
          students: data.students.length,
          activeStudents: data.students.filter(({ active }) => active).length,
          courses: data.courses.length,
          enrolled: data.enrollments.filter(
            ({ status }) => status === 'Approved' || status === 'Completed',
          ).length,
          pending: data.enrollments.filter(({ status }) => status === 'Pending').length,
        },
      })),
    );
  }
}
