// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-course-detail',
//   imports: [],
//   templateUrl: './course-detail.html',
//   styleUrl: './course-detail.scss',
// })
// export class CourseDetail {}

import { Component, input, effect } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  templateUrl: './course-detail.html',
  imports: [RouterLink],
})
export class CourseDetailComponent {
  // This automatically receives the :id from the URL /courses/:id
  // Because we enabled withComponentInputBinding() in app.config.ts(Step 2 of Excercise 1),
  // Angular maps the URL parameter ":id" directly to this input.
  // The name must match exactly: the route says ":id", so the inputiscalled "id".
  id = input.required<string>();
  // The constructor runs when the component is created.
  // effect() watches any signals read inside it. Every time id() changes
  // (e.g. navigating from /courses/1 to /courses/2), this code runsagain.
  constructor() {
    effect(() => {
      console.log(`Loading course detail for ID: ${this.id()}`);
    });
  }
}
