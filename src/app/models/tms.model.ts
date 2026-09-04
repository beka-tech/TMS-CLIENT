export type EnrollmentStatus = 'Pending' | 'Approved' | 'Rejected';

export interface Student {
  id: number;
  registrationNumber: string;
  name: string;
  email: string;
  gpa: number;
  active: boolean;
}

export type StudentDraft = Omit<Student, 'id'>;

export interface Assessment {
  id: number;
  title: string;
  weight: number;
  type: 'Assignment' | 'Quiz' | 'Midterm' | 'Final' | 'Project';
}

export interface TrainingCourse {
  id: number;
  code: string;
  title: string;
  description: string;
  capacity: number;
  instructor: string;
  assessments: readonly Assessment[];
}

export type CourseDraft = Omit<TrainingCourse, 'id' | 'assessments'>;

export interface EnrollmentRecord {
  id: string;
  studentId: number;
  courseId: number;
  status: EnrollmentStatus;
  grade: number | null;
  enrolledAt: string;
}

export interface CertificateRecord {
  id: number;
  serial: string;
  studentId: number;
  courseId: number;
  issuedAt: string;
}

export interface EnrollmentDraft {
  studentId: number;
  courseId: number;
}
