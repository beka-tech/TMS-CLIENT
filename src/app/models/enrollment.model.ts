export interface Enrollment {
  id: string;
  studentId: number;
  studentName: string;
  courseId: number;
  courseName: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  enrolledAt: string;
}
