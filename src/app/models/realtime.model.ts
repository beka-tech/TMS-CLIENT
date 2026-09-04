import { EnrollmentRecord, EnrollmentStatus, TranscriptStatus } from './tms.model';

export interface EnrollmentCreatedEvent {
  enrollment: EnrollmentRecord;
}

export interface EnrollmentStatusEvent {
  id: string;
  status: EnrollmentStatus;
}

export interface GradeSubmittedEvent {
  enrollmentId: string;
  grade: number;
}

export interface TranscriptStatusEvent {
  reportId: string;
  status: TranscriptStatus;
  downloadUrl?: string | null;
}
