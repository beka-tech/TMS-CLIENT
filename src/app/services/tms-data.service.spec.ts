import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { EnrollmentRecord, Student, TrainingCourse } from '../models/tms.model';
import { TmsDataService } from './tms-data.service';

describe('TmsDataService', () => {
  let service: TmsDataService;
  let http: HttpTestingController;

  const student: Student = {
    id: 17,
    registrationNumber: 'TMS-017',
    name: 'API Student',
    gpa: 3.5,
    active: true,
  };
  const studentApiResponse = { ...student, isActive: student.active, active: undefined };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(TmsDataService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('starts empty and populates students only from the API', () => {
    expect(service.students()).toEqual([]);

    service.loadStudents();
    expect(service.studentLoadState().loading).toBe(true);
    http
      .expectOne(
        (request) =>
          request.url === '/api/v2/students' &&
          request.params.get('page') === '1' &&
          request.params.get('pageSize') === '50',
      )
      .flush([studentApiResponse]);

    expect(service.students()).toEqual([student]);
    expect(service.studentLoadState()).toEqual({ loading: false, loaded: true, error: null });
  });

  it('applies student CRUD only after the backend confirms it', () => {
    const draft = { ...student };
    delete (draft as Partial<Student>).id;

    service.addStudent(draft).subscribe();
    expect(service.students()).toEqual([]);
    const create = http.expectOne('/api/v2/students');
    expect(create.request.method).toBe('POST');
    expect(create.request.body).toEqual({
      registrationNumber: student.registrationNumber,
      name: student.name,
      gpa: student.gpa,
      isActive: true,
    });
    create.flush(studentApiResponse);
    expect(service.students()).toEqual([student]);

    const updated = { ...student, name: 'Updated by API' };
    service.updateStudent(student.id, { ...draft, name: updated.name }).subscribe();
    expect(service.studentById(student.id)?.name).toBe(student.name);
    const update = http.expectOne(`/api/v2/students/${student.id}`);
    expect(update.request.method).toBe('PUT');
    update.flush({ ...updated, isActive: updated.active, active: undefined });
    expect(service.studentById(student.id)?.name).toBe(updated.name);

    service.deleteStudent(student.id).subscribe();
    expect(service.studentById(student.id)).toBeDefined();
    const remove = http.expectOne(`/api/v2/students/${student.id}`);
    expect(remove.request.method).toBe('DELETE');
    remove.flush(null);
    expect(service.studentById(student.id)).toBeUndefined();
  });

  it('creates courses from the server response', () => {
    const course: TrainingCourse = {
      id: 9,
      code: 'TST-900',
      title: 'Testing Fundamentals',
      capacity: 18,
      enrollmentCount: 0,
      assessments: [],
    };

    service
      .addCourse({
        code: course.code,
        title: course.title,
        capacity: course.capacity,
      })
      .subscribe();
    expect(service.courses()).toEqual([]);
    const request = http.expectOne('/api/v2/courses');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({
      code: course.code,
      title: course.title,
      maxCapacity: course.capacity,
    });
    request.flush({
      id: course.id,
      code: course.code,
      title: course.title,
      maxCapacity: course.capacity,
      enrollmentCount: 0,
    });
    expect(service.courses()).toEqual([course]);
  });

  it('creates, approves, and grades enrollments through the API', () => {
    const pending: EnrollmentRecord = {
      id: '2001',
      studentId: 17,
      courseId: 9,
      status: 'Pending',
      grade: null,
      enrolledAt: '2026-09-04T12:00:00Z',
    };

    service.loadCourses();
    http
      .expectOne((request) => request.url === '/api/v1/courses')
      .flush({
        items: [
          {
            id: 9,
            code: 'TST-900',
            title: 'Testing Fundamentals',
            maxCapacity: 18,
            enrollmentCount: 0,
          },
        ],
      });

    service.addEnrollment({ studentId: 17, courseId: 9 }).subscribe();
    const create = http.expectOne('/api/v2/enrollments');
    expect(create.request.body).toEqual({ studentId: 17, courseCode: 'TST-900' });
    create.flush(pending);
    expect(service.enrollments()).toEqual([pending]);

    service.setEnrollmentStatus(pending.id, 'Approved').subscribe();
    expect(service.enrollments()[0].status).toBe('Pending');
    http.expectOne(`/api/v2/enrollments/${pending.id}/approve`).flush(null);
    expect(service.enrollments()[0].status).toBe('Approved');

    const graded = { ...pending, status: 'Approved' as const, grade: 88 };
    service.setGrade(pending.id, 88).subscribe();
    const grade = http.expectOne(`/api/v2/enrollments/${pending.id}/grade`);
    expect(grade.request.method).toBe('PATCH');
    expect(grade.request.body).toEqual({ grade: 88 });
    grade.flush(null);
    expect(service.enrollments()[0]).toEqual(graded);
  });

  it('adds certificates only from the issue response', () => {
    service.issueCertificate('2001').subscribe();
    expect(service.certificates()).toEqual([]);
    const request = http.expectOne('/api/v1/certificates');
    expect(request.request.body).toEqual({ enrollmentId: '2001' });
    request.flush({
      id: 4,
      serial: 'CERT-00004',
      studentId: 17,
      courseId: 9,
      issuedAt: '2026-09-04T12:30:00Z',
    });
    expect(service.certificates()[0].serial).toBe('CERT-00004');
  });
});
