import { signalStore } from '@ngrx/signals';

import { withEntities } from '@ngrx/signals/entities';

import { Course } from '../models/course.model';

export const CourseStore = signalStore({ providedIn: 'root' }, withEntities<Course>());
