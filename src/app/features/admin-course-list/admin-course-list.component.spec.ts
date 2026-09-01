import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCourseListComponent } from './admin-course-list.component';

describe('AdminCourseListComponent', () => {
  let component: AdminCourseListComponent;
  let fixture: ComponentFixture<AdminCourseListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCourseListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminCourseListComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
