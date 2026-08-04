import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Enrollment } from '../models/enrollment.model';

@Service()
export class EnrollmentService {
  private http = inject(HttpClient);
  // private baseUrl = 'http://localhost:5150/api/enrollments';
  // private baseUrl = 'http://localhost:5150/api/courses/1/enrollments';
  private baseUrl = 'http://localhost:5150/api/v2/enrollments';

  getAll(): Observable<Enrollment[]> {
    return this.http.get<Enrollment[]>(this.baseUrl);
  }
  approve(id: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${id}/approve`, {
      status: 'Approved',
    });
  }
}
