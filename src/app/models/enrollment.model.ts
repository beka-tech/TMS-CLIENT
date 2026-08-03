export interface Enrollment {
  id: string;
  studentId: number;
  studentName: string;
  courseId: number;
  courseTitle: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  enrolledAt: string;
}
