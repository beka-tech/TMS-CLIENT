import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';

import { AuthService } from '../../services/auth.service';
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
        @if (deleteError()) {
          <p role="alert">{{ deleteError() }}</p>
        }

        <table>
          <thead>
            <tr>
              <th scope="col">Code</th>
              <th scope="col">Title</th>
              <th scope="col">Capacity</th>
              @if (auth.hasRole('Admin')) {
                <th scope="col">Actions</th>
              }
            </tr>
          </thead>
          <tbody>
            @for (course of coursesResource.value() ?? []; track course.id) {
              <tr>
                <td>{{ course.code }}</td>
                <td>{{ course.title }}</td>
                <td>{{ course.capacity }}</td>
                @if (auth.hasRole('Admin')) {
                  <td>
                    <button
                      type="button"
                      class="btn-danger"
                      [disabled]="deletingCourseId() === course.id"
                      (click)="deleteCourse(course.id)"
                    >
                      {{ deletingCourseId() === course.id ? 'Deleting...' : 'Delete course' }}
                    </button>
                  </td>
                }
              </tr>
            } @empty {
              <tr>
                <td [attr.colspan]="auth.hasRole('Admin') ? 4 : 3">No courses are available.</td>
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

    .btn-danger {
      padding: 0.5rem 0.75rem;
      border: 0;
      border-radius: 0.25rem;
      color: white;
      background: #b42318;
      cursor: pointer;
    }

    .btn-danger:disabled {
      cursor: wait;
      opacity: 0.65;
    }
  `,
})
export class AdminCourseListComponent {
  private readonly courseService = inject(CourseService);
  protected readonly auth = inject(AuthService);

  protected readonly deletingCourseId = signal<number | null>(null);
  protected readonly deleteError = signal<string | null>(null);

  readonly coursesResource = rxResource({
    stream: () => this.courseService.getAll(),
  });

  protected deleteCourse(id: number): void {
    if (!this.auth.hasRole('Admin') || this.deletingCourseId() !== null) {
      return;
    }

    this.deleteError.set(null);
    this.deletingCourseId.set(id);

    this.courseService.delete(id).subscribe({
      next: () => {
        this.deletingCourseId.set(null);
        this.coursesResource.reload();
      },
      error: () => {
        this.deletingCourseId.set(null);
        this.deleteError.set('The course could not be deleted.');
      },
    });
  }
}
