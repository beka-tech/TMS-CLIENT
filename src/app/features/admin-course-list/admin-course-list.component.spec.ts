import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { AuthService } from '../../services/auth.service';
import { CourseService } from '../../services/course.service';
import { AdminCourseListComponent } from './admin-course-list.component';

describe('AdminCourseListComponent', () => {
  let component: AdminCourseListComponent;
  let fixture: ComponentFixture<AdminCourseListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCourseListComponent],
      providers: [
        {
          provide: CourseService,
          useValue: {
            getAll: () => of([]),
            delete: () => of(undefined),
          },
        },
        {
          provide: AuthService,
          useValue: { hasRole: () => false },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminCourseListComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
