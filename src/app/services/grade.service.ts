import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../core/api-endpoints';
import { ApiClientService } from './api-client.service';

export interface GradePayload {
  studentId: number;
  courseId: number;
  score: number;
}

@Injectable({ providedIn: 'root' })
export class GradeService {
  private readonly api = inject(ApiClientService);

  postGrade(payload: GradePayload): Observable<{ id: string; success: boolean }> {
    return this.api.post<{ id: string; success: boolean }, GradePayload>(
      API_ENDPOINTS.grades,
      payload,
    );
  }
}
