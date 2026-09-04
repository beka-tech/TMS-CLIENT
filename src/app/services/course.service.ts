import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { API_ENDPOINTS, resourceUrl } from '../core/api-endpoints';
import { CourseDraft, TrainingCourse } from '../models/tms.model';
import { ApiClientService, ApiQuery } from './api-client.service';

interface CourseApiModel extends Partial<TrainingCourse> {
  id: number;
  code: string;
  title: string;
  maxCapacity?: number;
}

@Injectable({ providedIn: 'root' })
export class CourseService {
  private readonly api = inject(ApiClientService);

  getAll(page = 1, pageSize = 50): Observable<TrainingCourse[]> {
    const query: ApiQuery = { page, pageSize };
    return this.api
      .getCollection<CourseApiModel>(API_ENDPOINTS.courses, { params: query })
      .pipe(map((courses) => courses.map((course) => this.normalize(course))));
  }

  getById(id: string | number): Observable<TrainingCourse> {
    return this.api
      .get<CourseApiModel>(resourceUrl(API_ENDPOINTS.courses, id))
      .pipe(map((course) => this.normalize(course)));
  }

  create(course: CourseDraft): Observable<TrainingCourse> {
    return this.api.post<TrainingCourse, CourseDraft>(API_ENDPOINTS.courses, course);
  }

  update(id: number, course: CourseDraft): Observable<TrainingCourse> {
    return this.api.put<TrainingCourse, CourseDraft>(
      resourceUrl(API_ENDPOINTS.courses, id),
      course,
    );
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>(resourceUrl(API_ENDPOINTS.courses, id));
  }

  private normalize(course: CourseApiModel): TrainingCourse {
    return {
      id: course.id,
      code: course.code,
      title: course.title,
      description: course.description ?? 'Course details will be added soon.',
      capacity: course.capacity ?? course.maxCapacity ?? 0,
      instructor: course.instructor ?? 'To be assigned',
      assessments: course.assessments ?? [],
    };
  }
}
