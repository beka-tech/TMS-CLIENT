import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Course, CourseDetail, PagedResponse } from '../models/course.model';
// @Service() means Angular creates one instance of this service
// and shares it across the entire app. This is the Angular 22 shorthand replacing legacy @Injectable.
// This is similar to AddSingleton<T>() in .NET's dependency injection.
@Service()
export class CourseService {
  // inject(HttpClient) requests Angular's HTTP client the same pattern as inject(FormBuilder)
  private http = inject(HttpClient);
  // private baseUrl = 'http://localhost:5150/api/courses';
  private readonly base = `${environment.apiUrl}/courses`;

  getAll(page = 1, pageSize = 50) {
    // This URL is GET /api/courses → map items[] (M6 catalogue envelope). Never accept a bare root [...].
    // Switch to map((p) => p.data) if your base URL is GET /api/v2/courses; paging often nests under meta on that envelope (Step 1).
    return this.http
      .get<PagedResponse<Course>>(this.base, {
        params: { page: page.toString(), pageSize: pageSize.toString() },
      })
      .pipe(map((p) => p.items));
  }
  getById(id: string) {
    return this.http.get<CourseDetail>(`${this.base}/${id}`);
  }

  delete(id: number) {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
