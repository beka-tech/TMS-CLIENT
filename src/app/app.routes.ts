import { Routes } from '@angular/router';
export const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/student-dashboard/student-dashboard.component').then(
        (m) => m.StudentDashboardComponent,
      ),
  },

  {
    path: 'courses/:id',
    loadComponent: () =>
      import('./features/course-detail/course-detail').then((m) => m.CourseDetailComponent),
  },
  {
    path: 'enroll',
    loadComponent: () =>
      import('./features/enrollment-form/enrollment-form').then((m) => m.EnrollmentFormComponent),
  },
  {
    path: 'enroll_list',
    loadComponent: () =>
      import('./features/enrollment-list/enrollment-list').then((m) => m.EnrollmentListComponent),
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
];
