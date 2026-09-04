import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_ENDPOINTS, resourceUrl } from '../core/api-endpoints';
import { TranscriptReport, TranscriptRequest } from '../models/tms.model';
import { ApiClientService } from './api-client.service';

@Injectable({ providedIn: 'root' })
export class TranscriptService {
  private readonly api = inject(ApiClientService);

  request(studentId: number): Observable<TranscriptReport> {
    return this.api.post<TranscriptReport, TranscriptRequest>(API_ENDPOINTS.transcripts, {
      studentId,
    });
  }

  getStatus(reportId: string): Observable<TranscriptReport> {
    return this.api.get<TranscriptReport>(resourceUrl(API_ENDPOINTS.transcripts, reportId));
  }
}
