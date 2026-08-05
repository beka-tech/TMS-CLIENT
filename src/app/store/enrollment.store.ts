// import { computed, inject } from '@angular/core';
// import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
// import { setAllEntities, updateEntity, withEntities } from '@ngrx/signals/entities';
// import { rxMethod } from '@ngrx/signals/rxjs-interop';
// import { catchError, concatMap, EMPTY, map, pipe, tap } from 'rxjs';

// import { Enrollment } from '../models/enrollment.model';
// import { EnrollmentService } from '../services/enrollment';

// export const EnrollmentStore = signalStore(
//   { providedIn: 'root' },

//   withState({
//     isLoading: false,
//     error: null as string | null,
//   }),

//   withEntities<Enrollment>(),

//   withComputed((store) => ({
//     pendingCount: computed(
//       () => store.entities().filter((enrollment) => enrollment.status === 'Pending').length,
//     ),
//   })),

//   withMethods((store, api = inject(EnrollmentService)) => ({
//     loadEnrollments: rxMethod<void>(
//       pipe(
//         tap(() => {
//           patchState(store, {
//             isLoading: true,
//             error: null,
//           });
//         }),

//         concatMap(() =>
//           api.getAll().pipe(
//             tap((enrollments) => {
//               patchState(store, setAllEntities(enrollments), {
//                 isLoading: false,
//               });
//             }),

//             catchError((error: Error) => {
//               patchState(store, {
//                 isLoading: false,
//                 error: error.message,
//               });

//               return EMPTY;
//             }),
//           ),
//         ),
//       ),
//     ),

//     approveEnrollment: rxMethod<string>(
//       pipe(
//         map((id) => ({
//           id,
//           previousStatus: store.entityMap()[id]?.status,
//         })),

//         tap(({ id }) => {
//           patchState(
//             store,
//             updateEntity({
//               id,
//               changes: {
//                 status: 'Approved',
//               },
//             }),
//             {
//               error: null,
//             },
//           );
//         }),

//         concatMap(({ id, previousStatus }) =>
//           api.approve(id).pipe(
//             catchError(() => {
//               if (previousStatus) {
//                 patchState(
//                   store,
//                   updateEntity({
//                     id,
//                     changes: {
//                       status: previousStatus,
//                     },
//                   }),
//                 );
//               }

//               patchState(store, {
//                 error: 'Server rejected the approval. Check enrollment constraints.',
//               });

//               return EMPTY;
//             }),
//           ),
//         ),
//       ),
//     ),
//   })),
// );

import { computed, inject } from '@angular/core';
import { signalStore, withComputed, withMethods, patchState, withState } from '@ngrx/signals';

import { withEntities, setAllEntities, updateEntity } from '@ngrx/signals/entities';

import { rxMethod } from '@ngrx/signals/rxjs-interop';

import { pipe, concatMap, tap, catchError, EMPTY } from 'rxjs';

import { EnrollmentService } from '../services/enrollment';
import { Enrollment } from '../models/enrollment.model';

export const EnrollmentStore = signalStore(
  { providedIn: 'root' },

  // Holds UI state alongside the enrollment collection.
  withState({
    isLoading: false,
    error: null as string | null,
  }),

  // Stores enrollments as an entity collection for efficient lookups.
  withEntities<Enrollment>(),

  // Derived state that automatically updates whenever the entity collection changes.
  withComputed((store) => ({
    pendingCount: computed(() => store.entities().filter((e) => e.status === 'Pending').length),
  })),

  withMethods((store, api = inject(EnrollmentService)) => ({
    // Loads all enrollments from the API.
    loadEnrollments: rxMethod<void>(
      pipe(
        tap(() =>
          patchState(store, {
            isLoading: true,
            error: null,
          }),
        ),

        concatMap(() =>
          api.getAll().pipe(
            tap((rows) =>
              patchState(store, setAllEntities(rows), {
                isLoading: false,
              }),
            ),

            catchError((err) => {
              patchState(store, {
                isLoading: false,
                error: err.message,
              });

              return EMPTY;
            }),
          ),
        ),
      ),
    ),

    // Optimistically approves an enrollment.
    approveEnrollment: rxMethod<string>(
      pipe(
        tap((id) => {
          patchState(
            store,
            updateEntity({
              id,
              changes: {
                status: 'Approved',
              },
            }),
          );
        }),

        concatMap((id) =>
          api.approve(id).pipe(
            catchError(() => {
              patchState(
                store,
                updateEntity({
                  id,
                  changes: {
                    status: 'Pending',
                  },
                }),
              );

              patchState(store, {
                error: 'Server rejected the approval. Check enrollment constraints.',
              });

              return EMPTY;
            }),
          ),
        ),
      ),
    ),

    rejectEnrollment: rxMethod<string>(
      pipe(
        tap((id) => {
          patchState(
            store,
            updateEntity({
              id,
              changes: {
                status: 'Rejected',
              },
            }),
          );
        }),
        concatMap((id) =>
          api.reject(id).pipe(
            catchError(() => {
              patchState(
                store,
                updateEntity({
                  id,
                  changes: {
                    status: 'Pending',
                  },
                }),
              );

              patchState(store, {
                error: 'Server rejected the request.',
              });

              return EMPTY;
            }),
          ),
        ),
      ),
    ),
  })),
);
