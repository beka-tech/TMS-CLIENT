import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_ENDPOINTS, resourceUrl } from '../core/api-endpoints';
import { CertificateDraft, CertificateRecord } from '../models/tms.model';
import { ApiClientService, ApiQuery } from './api-client.service';

@Injectable({ providedIn: 'root' })
export class CertificateService {
  private readonly api = inject(ApiClientService);

  getAll(query: ApiQuery = {}): Observable<CertificateRecord[]> {
    return this.api.getCollection<CertificateRecord>(API_ENDPOINTS.certificates, { params: query });
  }

  getById(id: number): Observable<CertificateRecord> {
    return this.api.get<CertificateRecord>(resourceUrl(API_ENDPOINTS.certificates, id));
  }

  issue(request: CertificateDraft): Observable<CertificateRecord> {
    return this.api.post<CertificateRecord, CertificateDraft>(API_ENDPOINTS.certificates, request);
  }
}
