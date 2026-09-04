import { TestBed } from '@angular/core/testing';

import { TmsDataService } from './tms-data.service';

describe('TmsDataService', () => {
  let service: TmsDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TmsDataService);
  });

  it('adds, updates, and deletes students', () => {
    const initialCount = service.students().length;
    const created = service.addStudent({
      registrationNumber: 'TMS-099',
      name: 'Test Student',
      email: 'test.student@tms.edu',
      gpa: 3.5,
      active: true,
    });

    expect(service.students()).toHaveLength(initialCount + 1);
    expect(service.studentById(created.id)?.name).toBe('Test Student');

    service.updateStudent(created.id, {
      registrationNumber: 'TMS-099',
      name: 'Updated Student',
      email: 'updated.student@tms.edu',
      gpa: 3.7,
      active: false,
    });
    expect(service.studentById(created.id)).toMatchObject({
      name: 'Updated Student',
      gpa: 3.7,
      active: false,
    });

    service.deleteStudent(created.id);
    expect(service.studentById(created.id)).toBeUndefined();
    expect(service.students()).toHaveLength(initialCount);
  });

  it('cascades student deletion to enrollments and certificates', () => {
    expect(service.enrollments().some(({ studentId }) => studentId === 1)).toBe(true);
    expect(service.certificates().some(({ studentId }) => studentId === 1)).toBe(true);

    service.deleteStudent(1);

    expect(service.enrollments().some(({ studentId }) => studentId === 1)).toBe(false);
    expect(service.certificates().some(({ studentId }) => studentId === 1)).toBe(false);
  });

  it('adds a course with an empty assessment list', () => {
    const initialCount = service.courses().length;
    const course = service.addCourse({
      code: 'TS-900',
      title: 'Testing Fundamentals',
      description: 'A focused introduction to reliable automated tests.',
      capacity: 18,
      instructor: 'Aster Demo',
    });

    expect(service.courses()).toHaveLength(initialCount + 1);
    expect(service.courseById(course.id)).toEqual(course);
    expect(course.assessments).toEqual([]);
  });

  it('adds a pending enrollment and rejects an active duplicate', () => {
    const firstResult = service.addEnrollment({ studentId: 5, courseId: 5 });
    const created = service
      .enrollments()
      .find(({ studentId, courseId }) => studentId === 5 && courseId === 5);

    expect(firstResult.ok).toBe(true);
    expect(created).toMatchObject({ status: 'Pending', grade: null });
    expect(service.addEnrollment({ studentId: 5, courseId: 5 }).ok).toBe(false);
  });

  it('updates status and clamps grades while approving the enrollment', () => {
    service.addEnrollment({ studentId: 5, courseId: 5 });
    const enrollment = service
      .enrollments()
      .find(({ studentId, courseId }) => studentId === 5 && courseId === 5);
    expect(enrollment).toBeDefined();

    service.setEnrollmentStatus(enrollment!.id, 'Rejected');
    expect(service.enrollments().find(({ id }) => id === enrollment!.id)?.status).toBe('Rejected');

    service.setGrade(enrollment!.id, 120);
    expect(service.enrollments().find(({ id }) => id === enrollment!.id)).toMatchObject({
      grade: 100,
      status: 'Approved',
    });
  });

  it('issues one certificate only for an eligible enrollment', () => {
    const initialCount = service.certificates().length;

    expect(service.issueCertificate('ENR-1002').ok).toBe(false);

    const issued = service.issueCertificate('ENR-1007');
    expect(issued.ok).toBe(true);
    expect(service.certificates()).toHaveLength(initialCount + 1);
    expect(service.certificates()[0]).toMatchObject({
      serial: 'CERT-00004',
      studentId: 8,
      courseId: 2,
    });

    expect(service.issueCertificate('ENR-1007').ok).toBe(false);
    expect(service.certificates()).toHaveLength(initialCount + 1);
  });
});
