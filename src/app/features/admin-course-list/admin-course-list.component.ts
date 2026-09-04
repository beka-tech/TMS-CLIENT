import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';

import { CourseService } from '../../services/course.service';

@Component({
  selector: 'app-admin-course-list',
  standalone: true,
  template: `
    <main class="course-list">
      <h1>Course administration</h1>

      @if (coursesResource.isLoading()) {
        <p>Loading courses...</p>
      } @else if (coursesResource.error()) {
        <p role="alert">Courses could not be loaded.</p>
      } @else {
        <table>
          <thead>
            <tr>
              <th scope="col">Code</th>
              <th scope="col">Title</th>
              <th scope="col">Capacity</th>
            </tr>
          </thead>
          <tbody>
            @for (course of coursesResource.value() ?? []; track course.id) {
              <tr>
                <td>{{ course.code }}</td>
                <td>{{ course.title }}</td>
                <td>{{ course.capacity }}</td>
              </tr>
            } @empty {
              <tr>
                <td colspan="3">No courses are available.</td>
              </tr>
            }
          </tbody>
        </table>
      }
    </main>
  `,
  styles: `
    .course-list {
      max-width: 64rem;
      margin: 0 auto;
      padding: 2rem;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th,
    td {
      padding: 0.75rem;
      border-bottom: 1px solid #ddd;
      text-align: left;
    }
  `,
})
export class AdminCourseListComponent {
  private readonly courseService = inject(CourseService);

  readonly coursesResource = rxResource({
    stream: () => this.courseService.getAll(),
  });
}
