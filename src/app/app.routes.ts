import { Routes } from '@angular/router';
import { roleGuard } from './guards/role.guard';
export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/login/login.component').then((m) => m.LoginComponent),
  },
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
  {
    path: 'grade-submission',
    loadComponent: () =>
      import('./features/grade-submission/grade-submission.component').then(
        (m) => m.GradeSubmissionComponent,
      ),
  },
  {
        
    path: 'admin/courses',
    loadComponent: () =>
      import('./features/admin-course-list/admin-course-list.component').then(
        (m) => m.AdminCourseListComponent,
      ),
    canActivate: [roleGuard('Admin')],
  },
  {
    path: 'InstructorDashboard',
    loadComponent: () =>
      import('./features/instructor-dashboard/instructor-dashboard').then(
        (m) => m.InstructorDashboard,
      ),
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];
