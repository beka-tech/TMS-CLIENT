import { patchState, signalStore, withMethods } from '@ngrx/signals';
import { CourseService } from '../services/course.service';
import { inject } from '@angular/core';
import { removeEntity, setAllEntities } from '@ngrx/signals/entities';
import { catchError, EMPTY } from 'rxjs';

export const CourseStore = signalStore(
  { providedIn: 'root' },
  withMethods((store, svc = inject(CourseService)) => ({
    deleteCourse(id: number) {
      // 1. Take snapshot of current entities BEFORE mutating localstate
      const previousSnapshot = store.entities();
      // 2. Instant visual feedback — remove entity immediately fromlocal UI
      patchState(store, removeEntity(id));
      // 3. Dispatch API call to backend server
      svc
        .delete(id)
        .pipe(
          catchError((err) => {
            // 4. Server rejected request — restore previous snapshotand set error message
            patchState(store, setAllEntities(previousSnapshot));
            patchState(store, {
              error: 'Cannot delete course: active student enrollmentsexist.',
            });
            return EMPTY;
          }),
        )
        .subscribe();
    },
  })),
);
