import { computed, inject } from '@angular/core';
import { signalStore, withComputed, withMethods, patchState, withState } from '@ngrx/signals';
import { withEntities, setAllEntities, updateEntity } from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, concatMap, tap, catchError, EMPTY, switchMap } from 'rxjs';

// import { EnrollmentService } from '../services/enrollment.service';
import { EnrollmentService } from '../services/enrollment';

import { LiveSyncService } from '../services/live-sync'; // Import this
import { EnrollmentRecord } from '../models/tms.model';

export const EnrollmentStore = signalStore(
  { providedIn: 'root' },

  // Holds UI state alongside the enrollment collection.
  withState({
    isLoading: false,
    error: null as string | null,
  }),

  // Stores enrollments as an entity collection for efficient lookups.
  withEntities<EnrollmentRecord>(),

  // Derived state that automatically updates whenever the entity collection changes.
  withComputed((store) => ({
    pendingCount: computed(() => store.entities().filter((e) => e.status === 'Pending').length),
  })),

  // Inject BOTH services here
  withMethods((store, api = inject(EnrollmentService), sync = inject(LiveSyncService)) => ({
    // Listen for real-time updates from SignalR
    listenForLiveUpdates: rxMethod<void>(
      pipe(
        tap(() => sync.connect()),
        switchMap(() => sync.events$),
        tap((event) => {
          patchState(
            store,
            updateEntity({
              id: event.id,
              changes: {
                status: event.status,
              },
            }),
          );
        }),
      ),
    ),

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

    // Rejects an enrollment with optimistic update
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

// import { computed, inject } from '@angular/core';
// import { signalStore, withComputed, withMethods, patchState, withState } from '@ngrx/signals';

// import { withEntities, setAllEntities, updateEntity } from '@ngrx/signals/entities';

// import { rxMethod } from '@ngrx/signals/rxjs-interop';

// import { pipe, concatMap, tap, catchError, EMPTY } from 'rxjs';

// import { EnrollmentService } from '../services/enrollment';
// import { Enrollment } from '../models/enrollment.model';

// export const EnrollmentStore = signalStore(
//   { providedIn: 'root' },

//   // Holds UI state alongside the enrollment collection.
//   withState({
//     isLoading: false,
//     error: null as string | null,
//   }),

//   // Stores enrollments as an entity collection for efficient lookups.
//   withEntities<Enrollment>(),

//   // Derived state that automatically updates whenever the entity collection changes.
//   withComputed((store) => ({
//     pendingCount: computed(() => store.entities().filter((e) => e.status === 'Pending').length),
//   })),

//   withMethods((store, api = inject(EnrollmentService)) => ({
//     // Loads all enrollments from the API.
//     loadEnrollments: rxMethod<void>(
//       pipe(
//         tap(() =>
//           patchState(store, {
//             isLoading: true,
//             error: null,
//           }),
//         ),

//         concatMap(() =>
//           api.getAll().pipe(
//             tap((rows) =>
//               patchState(store, setAllEntities(rows), {
//                 isLoading: false,
//               }),
//             ),

//             catchError((err) => {
//               patchState(store, {
//                 isLoading: false,
//                 error: err.message,
//               });

//               return EMPTY;
//             }),
//           ),
//         ),
//       ),
//     ),

//     // Optimistically approves an enrollment.
//     approveEnrollment: rxMethod<string>(
//       pipe(
//         tap((id) => {
//           patchState(
//             store,
//             updateEntity({
//               id,
//               changes: {
//                 status: 'Approved',
//               },
//             }),
//           );
//         }),

//         concatMap((id) =>
//           api.approve(id).pipe(
//             catchError(() => {
//               patchState(
//                 store,
//                 updateEntity({
//                   id,
//                   changes: {
//                     status: 'Pending',
//                   },
//                 }),
//               );

//               patchState(store, {
//                 error: 'Server rejected the approval. Check enrollment constraints.',
//               });

//               return EMPTY;
//             }),
//           ),
//         ),
//       ),
//     ),

//     rejectEnrollment: rxMethod<string>(
//       pipe(
//         tap((id) => {
//           patchState(
//             store,
//             updateEntity({
//               id,
//               changes: {
//                 status: 'Rejected',
//               },
//             }),
//           );
//         }),
//         concatMap((id) =>
//           api.reject(id).pipe(
//             catchError(() => {
//               patchState(
//                 store,
//                 updateEntity({
//                   id,
//                   changes: {
//                     status: 'Pending',
//                   },
//                 }),
//               );

//               patchState(store, {
//                 error: 'Server rejected the request.',
//               });

//               return EMPTY;
//             }),
//           ),
//         ),
//       ),
//     ),
//   })),
// );
