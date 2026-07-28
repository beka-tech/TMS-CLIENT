// // These are the Angular functions we need. signal() and computed() come from Angular's core.
// import { Component, signal, computed } from '@angular/core';
// import { CourseCardComponent } from "../../ui/course-card/course-card";
// import { Course } from "../../models/course.model";
// // The @Component decorator tells Angular: "This class is a visual component."
// // It is metadata it describes how this class connects to the HTML template.
// @Component({
//   selector: 'app-student-dashboard', // The HTML tag name: <app-student-dashboard />
//   standalone: true, // This component manages its own imports (no NgModule)
//   templateUrl: './student-dashboard.component.html', // Points to theHTML file
//   styleUrl: './student-dashboard.component.scss', // Points to the styles file
// })
// export class StudentDashboardComponent {
//   // signal('Liya Kebede') creates a reactive variable. Angular watchesit.
//   // When its value changes, Angular automatically updates the part ofthe screen that displays it.
//   studentName = signal('Liya Kebede');
//   earnedCredits = signal(45);
//   // computed() creates a read-only signal that derives its value fromother signals.
//   // It recalculates automatically whenever earnedCredits() changes nomanual refresh.
//   graduationStatus = computed(() =>
//     this.earnedCredits() >= 120 ? 'Eligible for Graduation' : 'In Progress',
//   );
//   // A regular method. When called, it updates the earnedCredits signal.// The .update() method receives the current value (c) and returnsthe new value (c + 3).
//   registerForClass() {
//     this.earnedCredits.update((c) => c + 3);
//   }
// }

import { Component, signal, computed } from '@angular/core';
import { CourseCardComponent } from '../../ui/course-card/course-card';
import { Course } from '../../models/course.model';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,

  imports: [CourseCardComponent],
  templateUrl: './student-dashboard.component.html',
  styleUrl: './student-dashboard.component.scss',
})
export class StudentDashboardComponent {
  studentName = signal('Liya Kebede');
  earnedCredits = signal(45);

  graduationStatus = computed(() =>
    this.earnedCredits() >= 120 ? 'Eligible for Graduation' : 'In Progress',
  );

  selectedCourse = signal<Course | null>(null);

  sampleCourse: Course = {
    id: 1,
    title: 'Advanced Java Services',
    code: 'CSE-101',
    maxCapacity: 30,
    enrollmentCount: 12,
  };

  availableCourses = signal<Course[]>([
    {
      id: 1,
      title: 'Advanced Java Services',
      code: 'CSE-101',
      maxCapacity: 30,
      enrollmentCount: 10,
    },
    {
      id: 2,
      title: 'Angular UI Lab',
      code: 'CSE-210',
      maxCapacity: 25,
      enrollmentCount: 25,
    },
    {
      id: 3,
      title: 'Database Design',
      code: 'CSE-305',
      maxCapacity: 20,
      enrollmentCount: 18,
    },
    {
      id: 4,
      title: 'API Security Workshop',
      code: 'CSE-420',
      maxCapacity: 40,
      enrollmentCount: 15,
    },
  ]);

  registerForClass() {
    this.earnedCredits.update((c) => c + 3);
  }

  handleEnroll(course: Course) {
    this.selectedCourse.set(course);
    console.log('Enrollment requested for:', course.title);
  }
}
