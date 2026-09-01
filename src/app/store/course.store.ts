import { inject } from '@angular/core';
import { signalStore, withMethods, patchState } from '@ngrx/signals';

import { withEntities, removeEntity, setAllEntities } from '@ngrx/signals/entities';

import { CourseService } from '../services/course.service';
import { Course } from '../models/course.model';

export const CourseStore = signalStore(
  { providedIn: 'root' },

  withEntities<Course>(),

  withMethods((store, svc = inject(CourseService)) => ({
    deleteCourse(id: number) {
      const previousSnapshot = store.entities();

      patchState(store, removeEntity(id));

      try {
        svc.delete(id);
      } catch (err) {
        patchState(store, setAllEntities(previousSnapshot));

        console.error('Course deletion failed:', err);
      }
    },
  })),
);
