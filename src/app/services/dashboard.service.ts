import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../core/api-endpoints';
import { DashboardSummary } from '../models/tms.model';
import { ApiClientService } from './api-client.service';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly api = inject(ApiClientService);

  getSummary(): Observable<DashboardSummary> {
    return this.api.get<DashboardSummary>(API_ENDPOINTS.dashboard);
  }
}
