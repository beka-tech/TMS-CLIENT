import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_ENDPOINTS, resourceUrl } from '../core/api-endpoints';
import { EnrollmentDraft, EnrollmentRecord, GradeDraft } from '../models/tms.model';
import { ApiClientService, ApiQuery } from './api-client.service';

@Injectable({ providedIn: 'root' })
export class EnrollmentService {
  private readonly api = inject(ApiClientService);

  getAll(query: ApiQuery = {}): Observable<EnrollmentRecord[]> {
    return this.api.getCollection<EnrollmentRecord>(API_ENDPOINTS.enrollments, { params: query });
  }

  getById(id: string): Observable<EnrollmentRecord> {
    return this.api.get<EnrollmentRecord>(resourceUrl(API_ENDPOINTS.enrollments, id));
  }

  create(enrollment: EnrollmentDraft): Observable<EnrollmentRecord> {
    return this.api.post<EnrollmentRecord, EnrollmentDraft>(API_ENDPOINTS.enrollments, enrollment);
  }

  approve(id: string): Observable<void> {
    return this.api.post<void, Record<string, never>>(
      `${resourceUrl(API_ENDPOINTS.enrollments, id)}/approve`,
      {},
    );
  }

  reject(id: string): Observable<void> {
    return this.api.post<void, Record<string, never>>(
      `${resourceUrl(API_ENDPOINTS.enrollments, id)}/reject`,
      {},
    );
  }

  saveGrade(grade: GradeDraft): Observable<EnrollmentRecord> {
    return this.api.put<EnrollmentRecord, { score: number }>(
      `${resourceUrl(API_ENDPOINTS.enrollments, grade.enrollmentId)}/grade`,
      { score: grade.score },
    );
  }
}
