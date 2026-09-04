import { Routes } from '@angular/router';
import { AppShellComponent } from './layout/app-shell/app-shell';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: '',
    component: AppShellComponent,
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/student-dashboard/student-dashboard.component').then(
            (m) => m.StudentDashboardComponent,
          ),
      },
      {
        path: 'students',
        loadComponent: () =>
          import('./features/students/students.component').then((m) => m.StudentsComponent),
      },
      {
        path: 'courses',
        loadComponent: () => import('./features/courses/courses').then((m) => m.CoursesComponent),
      },
      {
        path: 'courses/:id',
        loadComponent: () =>
          import('./features/course-detail/course-detail').then((m) => m.CourseDetailComponent),
      },
      {
        path: 'enrollments',
        loadComponent: () =>
          import('./features/enrollment-list/enrollment-list').then(
            (m) => m.EnrollmentListComponent,
          ),
      },
      {
        path: 'certificates',
        loadComponent: () =>
          import('./features/certificates/certificates.component').then(
            (m) => m.CertificatesComponent,
          ),
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  { path: 'enroll', redirectTo: 'enrollments', pathMatch: 'full' },
  { path: 'enroll_list', redirectTo: 'enrollments', pathMatch: 'full' },
  { path: 'grade-submission', redirectTo: 'enrollments', pathMatch: 'full' },
  { path: 'admin/courses', redirectTo: 'courses', pathMatch: 'full' },
  { path: 'InstructorDashboard', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'dashboard' },
];
