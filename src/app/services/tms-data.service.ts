import { DestroyRef, Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, tap, throwError } from 'rxjs';
import { UserRole } from '../models/auth.model';
import {
  CertificateRecord,
  CourseDraft,
  EnrollmentDraft,
  EnrollmentRecord,
  EnrollmentStatus,
  Student,
  StudentDraft,
  TrainingCourse,
} from '../models/tms.model';
import { CertificateService } from './certificate.service';
import { CourseService } from './course.service';
import { DashboardService } from './dashboard.service';
import { EnrollmentService } from './enrollment';
import { apiErrorMessage } from './global-message.service';
import { LiveSyncService } from './live-sync';
import { StudentService } from './student.service';

export interface ResourceLoadState {
  loading: boolean;
  loaded: boolean;
  error: string | null;
}

const IDLE_LOAD_STATE: ResourceLoadState = { loading: false, loaded: false, error: null };

@Injectable({ providedIn: 'root' })
export class TmsDataService {
  private readonly destroyRef = inject(DestroyRef);
  private readonly studentApi = inject(StudentService);
  private readonly courseApi = inject(CourseService);
  private readonly enrollmentApi = inject(EnrollmentService);
  private readonly certificateApi = inject(CertificateService);
  private readonly dashboardApi = inject(DashboardService);
  private readonly liveSync = inject(LiveSyncService);

  private readonly studentState = signal<Student[]>([]);
  private readonly courseState = signal<TrainingCourse[]>([]);
  private readonly enrollmentState = signal<EnrollmentRecord[]>([]);
  private readonly certificateState = signal<CertificateRecord[]>([]);

  readonly dashboardLoadState = signal<ResourceLoadState>({ ...IDLE_LOAD_STATE });
  readonly studentLoadState = signal<ResourceLoadState>({ ...IDLE_LOAD_STATE });
  readonly courseLoadState = signal<ResourceLoadState>({ ...IDLE_LOAD_STATE });
  readonly enrollmentLoadState = signal<ResourceLoadState>({ ...IDLE_LOAD_STATE });
  readonly certificateLoadState = signal<ResourceLoadState>({ ...IDLE_LOAD_STATE });

  readonly students = this.studentState.asReadonly();
  readonly courses = this.courseState.asReadonly();
  readonly enrollments = this.enrollmentState.asReadonly();
  readonly certificates = this.certificateState.asReadonly();

  readonly dashboardStats = computed(() => ({
    students: this.studentState().length,
    activeStudents: this.studentState().filter(({ active }) => active).length,
    courses: this.courseState().length,
    enrolled: this.enrollmentState().filter(({ status }) => status === 'Approved').length,
    pending: this.enrollmentState().filter(({ status }) => status === 'Pending').length,
  }));

  constructor() {
    this.liveSync.enrollmentStatusUpdated$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(({ id, status }) => {
        this.replaceEnrollment(id, (row) => ({ ...row, status }));
        this.refreshDashboardSummary();
      });
    this.liveSync.gradePosted$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(({ courseCode, studentId, grade }) => {
        const courseId = this.courseState().find(({ code }) => code === courseCode)?.id;
        if (courseId === undefined) return;
        this.enrollmentState.update((rows) =>
          rows.map((row) =>
            row.studentId === studentId && row.courseId === courseId ? { ...row, grade } : row,
          ),
        );
      });
    this.liveSync.courseUpdate$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      if (this.courseLoadState().loaded) this.loadCourses();
    });
  }

  loadAll(): void {
    this.loadDashboard();
    this.loadCertificates();
  }

  loadForRole(role: UserRole): void {
    this.loadDashboard();
    if (role === 'Administrator') this.loadCertificates();
  }

  loadDashboardView(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.startLoading(this.dashboardLoadState);
    this.startLoading(this.studentLoadState);
    this.startLoading(this.courseLoadState);
    this.startLoading(this.enrollmentLoadState);
    this.dashboardApi
      .getData()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ students, courses, enrollments }) => {
          this.studentState.set(students);
          this.courseState.set(courses);
          this.enrollmentState.set(enrollments);
          this.liveSync.watchCourses(courses.map(({ code }) => code));
          this.finishLoading(this.dashboardLoadState);
          this.finishLoading(this.studentLoadState);
          this.finishLoading(this.courseLoadState);
          this.finishLoading(this.enrollmentLoadState);
        },
        error: (error: unknown) => {
          this.failLoading(this.dashboardLoadState, error);
          this.failLoading(this.studentLoadState, error);
          this.failLoading(this.courseLoadState, error);
          this.failLoading(this.enrollmentLoadState, error);
        },
      });
  }

  loadStudents(): void {
    this.startLoading(this.studentLoadState);
    this.studentApi
      .getAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (students) => {
          this.studentState.set(students);
          this.finishLoading(this.studentLoadState);
        },
        error: (error: unknown) => this.failLoading(this.studentLoadState, error),
      });
  }

  loadCourses(): void {
    this.startLoading(this.courseLoadState);
    this.courseApi
      .getAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (courses) => {
          this.courseState.set(courses);
          this.liveSync.watchCourses(courses.map(({ code }) => code));
          this.finishLoading(this.courseLoadState);
        },
        error: (error: unknown) => this.failLoading(this.courseLoadState, error),
      });
  }

  loadEnrollments(): void {
    this.startLoading(this.enrollmentLoadState);
    this.enrollmentApi
      .getAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (enrollments) => {
          this.enrollmentState.set(enrollments);
          this.finishLoading(this.enrollmentLoadState);
        },
        error: (error: unknown) => this.failLoading(this.enrollmentLoadState, error),
      });
  }

  loadCertificates(): void {
    this.startLoading(this.certificateLoadState);
    this.certificateApi
      .getAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (certificates) => {
          this.certificateState.set(certificates);
          this.finishLoading(this.certificateLoadState);
        },
        error: (error: unknown) => this.failLoading(this.certificateLoadState, error),
      });
  }

  studentById(id: number): Student | undefined {
    return this.studentState().find((student) => student.id === id);
  }

  courseById(id: number): TrainingCourse | undefined {
    return this.courseState().find((course) => course.id === id);
  }

  enrollmentCount(courseId: number): number {
    const loadedCount = this.enrollmentState().filter(
      (enrollment) => enrollment.courseId === courseId && enrollment.status !== 'Rejected',
    ).length;
    return this.enrollmentLoadState().loaded
      ? loadedCount
      : (this.courseById(courseId)?.enrollmentCount ?? loadedCount);
  }

  addStudent(draft: StudentDraft): Observable<Student> {
    return this.studentApi.create(draft).pipe(
      tap((created) => {
        this.studentState.update((students) => [...students, created]);
        this.refreshDashboardSummary();
      }),
    );
  }

  updateStudent(id: number, draft: StudentDraft): Observable<Student> {
    return this.studentApi.update(id, draft).pipe(
      tap((updated) => {
        this.studentState.update((students) =>
          students.map((student) => (student.id === id ? updated : student)),
        );
      }),
    );
  }

  deleteStudent(id: number): Observable<void> {
    return this.studentApi.delete(id).pipe(
      tap(() => {
        this.studentState.update((students) => students.filter((student) => student.id !== id));
        this.enrollmentState.update((rows) => rows.filter((row) => row.studentId !== id));
        this.certificateState.update((rows) => rows.filter((row) => row.studentId !== id));
        this.refreshDashboardSummary();
      }),
    );
  }

  addCourse(draft: CourseDraft): Observable<TrainingCourse> {
    return this.courseApi.create(draft).pipe(
      tap((created) => {
        this.courseState.update((courses) => [...courses, created]);
        this.refreshDashboardSummary();
      }),
    );
  }

  addEnrollment(draft: EnrollmentDraft): Observable<EnrollmentRecord> {
    const course = this.courseById(draft.courseId);
    if (!course) return throwError(() => new Error('Choose an available course.'));
    return this.enrollmentApi.create({ studentId: draft.studentId, courseCode: course.code }).pipe(
      tap((created) => {
        this.upsertEnrollment(created, true);
        this.refreshDashboardSummary();
      }),
    );
  }

  setEnrollmentStatus(id: string, status: EnrollmentStatus): Observable<void> {
    if (status === 'Pending') {
      return throwError(() => new Error('Pending is not a supported status transition.'));
    }
    const request =
      status === 'Approved' ? this.enrollmentApi.approve(id) : this.enrollmentApi.reject(id);
    return request.pipe(
      tap(() => {
        this.replaceEnrollment(id, (row) => ({ ...row, status }));
        this.refreshDashboardSummary();
      }),
    );
  }

  setGrade(id: string, grade: number): Observable<void> {
    const normalizedGrade = Math.min(100, Math.max(0, grade));
    return this.enrollmentApi
      .saveGrade({ enrollmentId: id, score: normalizedGrade })
      .pipe(tap(() => this.replaceEnrollment(id, (row) => ({ ...row, grade: normalizedGrade }))));
  }

  issueCertificate(enrollmentId: string): Observable<CertificateRecord> {
    return this.certificateApi.issue({ enrollmentId }).pipe(
      tap((issued) => {
        this.certificateState.update((rows) => [
          issued,
          ...rows.filter(({ id }) => id !== issued.id),
        ]);
      }),
    );
  }

  private startLoading(state: { set(value: ResourceLoadState): void }): void {
    state.set({ loading: true, loaded: false, error: null });
  }

  private finishLoading(state: { set(value: ResourceLoadState): void }): void {
    state.set({ loading: false, loaded: true, error: null });
  }

  private failLoading(state: { set(value: ResourceLoadState): void }, error: unknown): void {
    state.set({ loading: false, loaded: false, error: apiErrorMessage(error) });
  }

  private replaceEnrollment(id: string, update: (row: EnrollmentRecord) => EnrollmentRecord): void {
    this.enrollmentState.update((rows) => rows.map((row) => (row.id === id ? update(row) : row)));
  }

  private upsertEnrollment(enrollment: EnrollmentRecord, prepend = false): void {
    this.enrollmentState.update((rows) => {
      const remaining = rows.filter(({ id }) => id !== enrollment.id);
      return prepend ? [enrollment, ...remaining] : [...remaining, enrollment];
    });
  }

  private refreshDashboardSummary(): void {
    if (this.dashboardLoadState().loaded) this.loadDashboard();
  }
}
