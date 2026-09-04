import { DestroyRef, Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
  DashboardSummary,
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

const STUDENTS: Student[] = [
  {
    id: 1,
    registrationNumber: 'TMS-001',
    name: 'Abebe Bekele',
    email: 'abebe.bekele@tms.edu',
    gpa: 3.4,
    active: true,
  },
  {
    id: 2,
    registrationNumber: 'TMS-002',
    name: 'Sara Mohammed',
    email: 'sara.mohammed@tms.edu',
    gpa: 3.8,
    active: true,
  },
  {
    id: 3,
    registrationNumber: 'TMS-003',
    name: 'Dawit Alemu',
    email: 'dawit.alemu@tms.edu',
    gpa: 3.2,
    active: true,
  },
  {
    id: 4,
    registrationNumber: 'TMS-004',
    name: 'Hana Tesfaye',
    email: 'hana.tesfaye@tms.edu',
    gpa: 3.6,
    active: true,
  },
  {
    id: 5,
    registrationNumber: 'TMS-005',
    name: 'Samuel Girma',
    email: 'samuel.girma@tms.edu',
    gpa: 2.9,
    active: false,
  },
  {
    id: 6,
    registrationNumber: 'TMS-006',
    name: 'Meron Tadesse',
    email: 'meron.tadesse@tms.edu',
    gpa: 3.7,
    active: true,
  },
  {
    id: 7,
    registrationNumber: 'TMS-007',
    name: 'Nahom Getachew',
    email: 'nahom.getachew@tms.edu',
    gpa: 3.1,
    active: true,
  },
  {
    id: 8,
    registrationNumber: 'TMS-008',
    name: 'Liya Kebede',
    email: 'liya.kebede@tms.edu',
    gpa: 3.9,
    active: true,
  },
];

const COURSES: TrainingCourse[] = [
  {
    id: 1,
    code: 'CS-401',
    title: 'ASP.NET Core',
    description: 'Build secure, production-ready web APIs with modern .NET.',
    capacity: 30,
    instructor: 'Dr. Rahel Bekele',
    assessments: [
      { id: 1, title: 'API design assignment', weight: 20, type: 'Assignment' },
      { id: 2, title: 'Midterm assessment', weight: 30, type: 'Midterm' },
      { id: 3, title: 'Final project', weight: 50, type: 'Final' },
    ],
  },
  {
    id: 2,
    code: 'NG-201',
    title: 'Angular',
    description: 'Create accessible, reactive applications with modern Angular.',
    capacity: 25,
    instructor: 'Marta Assefa',
    assessments: [
      { id: 4, title: 'Components and signals', weight: 25, type: 'Assignment' },
      { id: 5, title: 'Application build', weight: 35, type: 'Project' },
      { id: 6, title: 'Final assessment', weight: 40, type: 'Final' },
    ],
  },
  {
    id: 3,
    code: 'DB-305',
    title: 'PostgreSQL',
    description: 'Model relational data and write efficient production queries.',
    capacity: 24,
    instructor: 'Yonatan Desta',
    assessments: [
      { id: 7, title: 'Schema modelling', weight: 30, type: 'Assignment' },
      { id: 8, title: 'Query practical', weight: 30, type: 'Midterm' },
      { id: 9, title: 'Database project', weight: 40, type: 'Project' },
    ],
  },
  {
    id: 4,
    code: 'UX-110',
    title: 'UX Foundations',
    description: 'Plan and validate clear, inclusive digital experiences.',
    capacity: 20,
    instructor: 'Selam Worku',
    assessments: [
      { id: 10, title: 'Research synthesis', weight: 30, type: 'Assignment' },
      { id: 11, title: 'Prototype critique', weight: 30, type: 'Project' },
      { id: 12, title: 'Portfolio case study', weight: 40, type: 'Final' },
    ],
  },
  {
    id: 5,
    code: 'CL-220',
    title: 'Cloud Fundamentals',
    description: 'Understand cloud services, delivery models, and operations.',
    capacity: 28,
    instructor: 'Betelhem Kassaye',
    assessments: [
      { id: 13, title: 'Cloud concepts quiz', weight: 20, type: 'Quiz' },
      { id: 14, title: 'Architecture exercise', weight: 30, type: 'Assignment' },
      { id: 15, title: 'Final assessment', weight: 50, type: 'Final' },
    ],
  },
];

const ENROLLMENTS: EnrollmentRecord[] = [
  {
    id: 'ENR-1001',
    studentId: 1,
    courseId: 1,
    status: 'Approved',
    grade: 85,
    enrolledAt: '2026-09-03T08:45:00Z',
  },
  {
    id: 'ENR-1002',
    studentId: 2,
    courseId: 2,
    status: 'Pending',
    grade: null,
    enrolledAt: '2026-09-03T07:20:00Z',
  },
  {
    id: 'ENR-1003',
    studentId: 3,
    courseId: 3,
    status: 'Approved',
    grade: 78,
    enrolledAt: '2026-09-02T14:15:00Z',
  },
  {
    id: 'ENR-1004',
    studentId: 4,
    courseId: 1,
    status: 'Pending',
    grade: null,
    enrolledAt: '2026-09-02T10:05:00Z',
  },
  {
    id: 'ENR-1005',
    studentId: 6,
    courseId: 4,
    status: 'Approved',
    grade: 92,
    enrolledAt: '2026-09-01T11:30:00Z',
  },
  {
    id: 'ENR-1006',
    studentId: 7,
    courseId: 5,
    status: 'Rejected',
    grade: null,
    enrolledAt: '2026-08-31T09:10:00Z',
  },
  {
    id: 'ENR-1007',
    studentId: 8,
    courseId: 2,
    status: 'Approved',
    grade: 88,
    enrolledAt: '2026-08-30T15:55:00Z',
  },
  {
    id: 'ENR-1008',
    studentId: 2,
    courseId: 1,
    status: 'Approved',
    grade: null,
    enrolledAt: '2026-08-30T10:35:00Z',
  },
  {
    id: 'ENR-1009',
    studentId: 3,
    courseId: 2,
    status: 'Pending',
    grade: null,
    enrolledAt: '2026-08-29T13:25:00Z',
  },
];

const CERTIFICATES: CertificateRecord[] = [
  { id: 1, serial: 'CERT-00001', studentId: 1, courseId: 1, issuedAt: '2026-09-03T00:00:00Z' },
  { id: 2, serial: 'CERT-00002', studentId: 3, courseId: 3, issuedAt: '2026-09-02T00:00:00Z' },
  { id: 3, serial: 'CERT-00003', studentId: 6, courseId: 4, issuedAt: '2026-09-01T00:00:00Z' },
];

@Injectable({ providedIn: 'root' })
export class TmsDataService {
  private readonly destroyRef = inject(DestroyRef);
  private readonly studentApi = inject(StudentService);
  private readonly courseApi = inject(CourseService);
  private readonly enrollmentApi = inject(EnrollmentService);
  private readonly certificateApi = inject(CertificateService);
  private readonly dashboardApi = inject(DashboardService);
  private readonly liveSync = inject(LiveSyncService);

  private readonly studentState = signal<Student[]>(STUDENTS);
  private readonly courseState = signal<TrainingCourse[]>(COURSES);
  private readonly enrollmentState = signal<EnrollmentRecord[]>(ENROLLMENTS);
  private readonly certificateState = signal<CertificateRecord[]>(CERTIFICATES);
  private readonly dashboardSummaryState = signal<DashboardSummary | null>(null);

  readonly dashboardLoadState = signal<ResourceLoadState>({ ...IDLE_LOAD_STATE });
  readonly studentLoadState = signal<ResourceLoadState>({ ...IDLE_LOAD_STATE });
  readonly courseLoadState = signal<ResourceLoadState>({ ...IDLE_LOAD_STATE });
  readonly enrollmentLoadState = signal<ResourceLoadState>({ ...IDLE_LOAD_STATE });
  readonly certificateLoadState = signal<ResourceLoadState>({ ...IDLE_LOAD_STATE });

  readonly students = this.studentState.asReadonly();
  readonly courses = this.courseState.asReadonly();
  readonly enrollments = this.enrollmentState.asReadonly();
  readonly certificates = this.certificateState.asReadonly();

  readonly dashboardStats = computed(
    () =>
      this.dashboardSummaryState() ?? {
        students: this.studentState().length,
        activeStudents: this.studentState().filter(({ active }) => active).length,
        courses: this.courseState().length,
        enrolled: this.enrollmentState().filter(({ status }) => status === 'Approved').length,
        pending: this.enrollmentState().filter(({ status }) => status === 'Pending').length,
      },
  );

  constructor() {
    this.liveSync.enrollmentCreated$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(({ enrollment }) => {
        this.enrollmentState.update((rows) => [
          enrollment,
          ...rows.filter(({ id }) => id !== enrollment.id),
        ]);
        this.refreshDashboardSummary();
      });
    this.liveSync.enrollmentStatusUpdated$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(({ id, status }) => {
        this.replaceEnrollment(id, (row) => ({ ...row, status }));
        this.refreshDashboardSummary();
      });
    this.liveSync.gradeSubmitted$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(({ enrollmentId, grade }) => {
        this.replaceEnrollment(enrollmentId, (row) => ({
          ...row,
          grade,
          status: 'Approved',
        }));
      });
  }

  loadAll(): void {
    this.loadDashboardView();
    this.loadStudents();
    this.loadCourses();
    this.loadCertificates();
  }

  loadForRole(role: UserRole): void {
    this.loadDashboardView();
    this.loadCourses();
    if (role === 'Instructor' || role === 'Administrator') this.loadStudents();
    if (role === 'Administrator') this.loadCertificates();
  }

  loadDashboardView(): void {
    this.loadDashboard();
    this.loadEnrollments();
  }

  loadDashboard(): void {
    this.startLoading(this.dashboardLoadState);
    this.dashboardApi
      .getSummary()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (summary) => {
          this.dashboardSummaryState.set(summary);
          this.finishLoading(this.dashboardLoadState);
        },
        error: (error: unknown) => this.failLoading(this.dashboardLoadState, error),
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
    return this.enrollmentState().filter(
      (enrollment) => enrollment.courseId === courseId && enrollment.status !== 'Rejected',
    ).length;
  }

  addStudent(draft: StudentDraft): Student {
    const student = { ...draft, id: this.nextNumericId(this.studentState()) };
    this.studentState.update((students) => [...students, student]);
    this.studentApi
      .create(draft)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (created) =>
          this.studentState.update((students) =>
            students.map((row) => (row.id === student.id ? created : row)),
          ),
        error: () =>
          this.studentState.update((students) => students.filter(({ id }) => id !== student.id)),
      });
    return student;
  }

  updateStudent(id: number, draft: StudentDraft): void {
    const previous = this.studentById(id);
    this.studentState.update((students) =>
      students.map((student) => (student.id === id ? { ...draft, id } : student)),
    );
    this.studentApi
      .update(id, draft)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (updated) =>
          this.studentState.update((students) =>
            students.map((student) => (student.id === id ? updated : student)),
          ),
        error: () => {
          if (previous) {
            this.studentState.update((students) =>
              students.map((student) => (student.id === id ? previous : student)),
            );
          }
        },
      });
  }

  deleteStudent(id: number): void {
    const previousStudents = this.studentState();
    const previousEnrollments = this.enrollmentState();
    const previousCertificates = this.certificateState();
    this.studentState.update((students) => students.filter((student) => student.id !== id));
    this.enrollmentState.update((rows) => rows.filter((row) => row.studentId !== id));
    this.certificateState.update((rows) => rows.filter((row) => row.studentId !== id));
    this.studentApi
      .delete(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        error: () => {
          this.studentState.set(previousStudents);
          this.enrollmentState.set(previousEnrollments);
          this.certificateState.set(previousCertificates);
        },
      });
  }

  addCourse(draft: CourseDraft): TrainingCourse {
    const course: TrainingCourse = {
      ...draft,
      id: this.nextNumericId(this.courseState()),
      assessments: [],
    };
    this.courseState.update((courses) => [...courses, course]);
    this.courseApi
      .create(draft)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (created) =>
          this.courseState.update((courses) =>
            courses.map((row) => (row.id === course.id ? created : row)),
          ),
        error: () =>
          this.courseState.update((courses) => courses.filter(({ id }) => id !== course.id)),
      });
    return course;
  }

  addEnrollment(draft: EnrollmentDraft): { ok: boolean; message: string } {
    const duplicate = this.enrollmentState().some(
      (row) =>
        row.studentId === draft.studentId &&
        row.courseId === draft.courseId &&
        row.status !== 'Rejected',
    );
    if (duplicate) {
      return {
        ok: false,
        message: 'This student already has an active enrollment for the course.',
      };
    }

    const course = this.courseById(draft.courseId);
    if (!course) {
      return { ok: false, message: 'Choose an available course.' };
    }
    if (this.enrollmentCount(course.id) >= course.capacity) {
      return { ok: false, message: 'This course has reached its capacity.' };
    }

    const nextNumber =
      Math.max(
        1000,
        ...this.enrollmentState().map((row) => Number(row.id.replace(/\D/g, '')) || 0),
      ) + 1;
    const enrollment: EnrollmentRecord = {
      id: `ENR-${nextNumber}`,
      studentId: draft.studentId,
      courseId: draft.courseId,
      status: 'Pending',
      grade: null,
      enrolledAt: new Date().toISOString(),
    };
    this.enrollmentState.update((rows) => [enrollment, ...rows]);
    this.enrollmentApi
      .create(draft)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (created) =>
          this.enrollmentState.update((rows) =>
            rows.map((row) => (row.id === enrollment.id ? created : row)),
          ),
        error: () =>
          this.enrollmentState.update((rows) => rows.filter(({ id }) => id !== enrollment.id)),
      });
    return { ok: true, message: 'Enrollment added and marked as pending.' };
  }

  setEnrollmentStatus(id: string, status: EnrollmentStatus): void {
    const previous = this.enrollmentState();
    this.enrollmentState.update((rows) =>
      rows.map((row) => (row.id === id ? { ...row, status } : row)),
    );
    const request =
      status === 'Approved' ? this.enrollmentApi.approve(id) : this.enrollmentApi.reject(id);
    request.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      error: () => this.enrollmentState.set(previous),
    });
  }

  setGrade(id: string, grade: number): void {
    const normalizedGrade = Math.min(100, Math.max(0, grade));
    const previous = this.enrollmentState();
    this.enrollmentState.update((rows) =>
      rows.map((row) =>
        row.id === id ? { ...row, grade: normalizedGrade, status: 'Approved' } : row,
      ),
    );
    this.enrollmentApi
      .saveGrade({ enrollmentId: id, score: normalizedGrade })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (updated) => this.replaceEnrollment(id, () => updated),
        error: () => this.enrollmentState.set(previous),
      });
  }

  issueCertificate(enrollmentId: string): { ok: boolean; message: string } {
    const enrollment = this.enrollmentState().find((row) => row.id === enrollmentId);
    if (!enrollment || enrollment.status !== 'Approved' || (enrollment.grade ?? 0) < 50) {
      return { ok: false, message: 'Only completed, passing enrollments are eligible.' };
    }
    const duplicate = this.certificateState().some(
      (row) => row.studentId === enrollment.studentId && row.courseId === enrollment.courseId,
    );
    if (duplicate) {
      return { ok: false, message: 'A certificate has already been issued for this enrollment.' };
    }

    const id = this.nextNumericId(this.certificateState());
    const certificate: CertificateRecord = {
      id,
      serial: `CERT-${String(id).padStart(5, '0')}`,
      studentId: enrollment.studentId,
      courseId: enrollment.courseId,
      issuedAt: new Date().toISOString(),
    };
    this.certificateState.update((rows) => [certificate, ...rows]);
    this.certificateApi
      .issue({ enrollmentId })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (issued) =>
          this.certificateState.update((rows) =>
            rows.map((row) => (row.id === certificate.id ? issued : row)),
          ),
        error: () =>
          this.certificateState.update((rows) =>
            rows.filter(({ id: rowId }) => rowId !== certificate.id),
          ),
      });
    return { ok: true, message: 'Certificate issued successfully.' };
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

  private refreshDashboardSummary(): void {
    if (this.dashboardLoadState().loaded) this.loadDashboard();
  }

  private nextNumericId(rows: readonly { id: number }[]): number {
    return Math.max(0, ...rows.map(({ id }) => id)) + 1;
  }
}
