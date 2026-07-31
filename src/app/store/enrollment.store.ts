import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { setAllEntities, updateEntity, withEntities } from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, concatMap, EMPTY, map, pipe, tap } from 'rxjs';

import { Enrollment } from '../models/enrollment.model';
import { EnrollmentService } from '../services/enrollment';

export const EnrollmentStore = signalStore(
  { providedIn: 'root' },

  withState({
    isLoading: false,
    error: null as string | null,
  }),

  withEntities<Enrollment>(),

  withComputed((store) => ({
    pendingCount: computed(
      () => store.entities().filter((enrollment) => enrollment.status === 'Pending').length,
    ),
  })),

  withMethods((store, api = inject(EnrollmentService)) => ({
    loadEnrollments: rxMethod<void>(
      pipe(
        tap(() => {
          patchState(store, {
            isLoading: true,
            error: null,
          });
        }),

        concatMap(() =>
          api.getAll().pipe(
            tap((enrollments) => {
              patchState(store, setAllEntities(enrollments), {
                isLoading: false,
              });
            }),

            catchError((error: Error) => {
              patchState(store, {
                isLoading: false,
                error: error.message,
              });

              return EMPTY;
            }),
          ),
        ),
      ),
    ),

    approveEnrollment: rxMethod<string>(
      pipe(
        map((id) => ({
          id,
          previousStatus: store.entityMap()[id]?.status,
        })),

        tap(({ id }) => {
          patchState(
            store,
            updateEntity({
              id,
              changes: {
                status: 'Approved',
              },
            }),
            {
              error: null,
            },
          );
        }),

        concatMap(({ id, previousStatus }) =>
          api.approve(id).pipe(
            catchError(() => {
              if (previousStatus) {
                patchState(
                  store,
                  updateEntity({
                    id,
                    changes: {
                      status: previousStatus,
                    },
                  }),
                );
              }

              patchState(store, {
                error: 'Server rejected the approval. Check enrollment constraints.',
              });

              return EMPTY;
            }),
          ),
        ),
      ),
    ),
  })),
);
