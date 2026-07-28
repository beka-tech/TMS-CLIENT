import { Component, input, output } from '@angular/core';
import { Course } from '../../models/course.model';
@Component({
  selector: 'tms-course-card',
  standalone: true,
  templateUrl: './course-card.html',
  styleUrl: './course-card.scss',
})
export class CourseCardComponent {
  course = input.required<Course>();
  enrollClicked = output<Course>();
}
