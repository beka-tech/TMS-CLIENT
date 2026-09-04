import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { API_ENDPOINTS, resourceUrl } from '../core/api-endpoints';
import { ApiClientService } from './api-client.service';

export interface GradePayload {
  enrollmentId: string | number;
  score: number;
}

@Injectable({ providedIn: 'root' })
export class GradeService {
  private readonly api = inject(ApiClientService);

  postGrade(payload: GradePayload): Observable<{ id: string; success: boolean }> {
    return this.api
      .patch<void, { grade: number }>(
        `${resourceUrl(API_ENDPOINTS.enrollments, payload.enrollmentId)}/grade`,
        { grade: payload.score },
      )
      .pipe(map(() => ({ id: String(payload.enrollmentId), success: true })));
  }
}
