export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    refresh: '/auth/refresh',
    logout: '/auth/logout',
    currentUser: '/auth/me',
  },
  dashboard: '/v1/dashboard',
  students: '/v1/students',
  courses: '/v1/courses',
  enrollments: '/v2/enrollments',
  grades: '/grades',
  certificates: '/v1/certificates',
  transcripts: '/v1/transcripts',
} as const;

export const TMS_HUB_EVENTS = {
  enrollmentCreated: 'ReceiveEnrollmentCreated',
  enrollmentStatusUpdated: 'ReceiveEnrollmentStatusUpdated',
  gradeSubmitted: 'ReceiveGradeSubmitted',
  transcriptStatusUpdated: 'ReceiveTranscriptStatusUpdated',
} as const;

export function resourceUrl(base: string, id: string | number): string {
  return `${base}/${encodeURIComponent(String(id))}`;
}
