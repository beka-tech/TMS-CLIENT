import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_ENDPOINTS, resourceUrl } from '../core/api-endpoints';
import { Student, StudentDraft } from '../models/tms.model';
import { ApiClientService, ApiQuery } from './api-client.service';

@Injectable({ providedIn: 'root' })
export class StudentService {
  private readonly api = inject(ApiClientService);

  getAll(query: ApiQuery = {}): Observable<Student[]> {
    return this.api.getCollection<Student>(API_ENDPOINTS.students, { params: query });
  }

  getById(id: number): Observable<Student> {
    return this.api.get<Student>(resourceUrl(API_ENDPOINTS.students, id));
  }

  create(student: StudentDraft): Observable<Student> {
    return this.api.post<Student, StudentDraft>(API_ENDPOINTS.students, student);
  }

  update(id: number, student: StudentDraft): Observable<Student> {
    return this.api.put<Student, StudentDraft>(resourceUrl(API_ENDPOINTS.students, id), student);
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>(resourceUrl(API_ENDPOINTS.students, id));
  }
}
