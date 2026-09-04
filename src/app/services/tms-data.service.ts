import { Injectable, computed, signal } from '@angular/core';
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
  private readonly studentState = signal<Student[]>(STUDENTS);
  private readonly courseState = signal<TrainingCourse[]>(COURSES);
  private readonly enrollmentState = signal<EnrollmentRecord[]>(ENROLLMENTS);
  private readonly certificateState = signal<CertificateRecord[]>(CERTIFICATES);

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
    return student;
  }

  updateStudent(id: number, draft: StudentDraft): void {
    this.studentState.update((students) =>
      students.map((student) => (student.id === id ? { ...draft, id } : student)),
    );
  }

  deleteStudent(id: number): void {
    this.studentState.update((students) => students.filter((student) => student.id !== id));
    this.enrollmentState.update((rows) => rows.filter((row) => row.studentId !== id));
    this.certificateState.update((rows) => rows.filter((row) => row.studentId !== id));
  }

  addCourse(draft: CourseDraft): TrainingCourse {
    const course: TrainingCourse = {
      ...draft,
      id: this.nextNumericId(this.courseState()),
      assessments: [],
    };
    this.courseState.update((courses) => [...courses, course]);
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
    this.enrollmentState.update((rows) => [
      {
        id: `ENR-${nextNumber}`,
        studentId: draft.studentId,
        courseId: draft.courseId,
        status: 'Pending',
        grade: null,
        enrolledAt: new Date().toISOString(),
      },
      ...rows,
    ]);
    return { ok: true, message: 'Enrollment added and marked as pending.' };
  }

  setEnrollmentStatus(id: string, status: EnrollmentStatus): void {
    this.enrollmentState.update((rows) =>
      rows.map((row) => (row.id === id ? { ...row, status } : row)),
    );
  }

  setGrade(id: string, grade: number): void {
    const normalizedGrade = Math.min(100, Math.max(0, grade));
    this.enrollmentState.update((rows) =>
      rows.map((row) =>
        row.id === id ? { ...row, grade: normalizedGrade, status: 'Approved' } : row,
      ),
    );
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
    this.certificateState.update((rows) => [
      {
        id,
        serial: `CERT-${String(id).padStart(5, '0')}`,
        studentId: enrollment.studentId,
        courseId: enrollment.courseId,
        issuedAt: new Date().toISOString(),
      },
      ...rows,
    ]);
    return { ok: true, message: 'Certificate issued successfully.' };
  }

  private nextNumericId(rows: readonly { id: number }[]): number {
    return Math.max(0, ...rows.map(({ id }) => id)) + 1;
  }
}
