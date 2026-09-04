import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';

import { EnrollmentStore } from '../../store/enrollment.store';
import { InstructorDashboard } from './instructor-dashboard';

describe('InstructorDashboard', () => {
  let component: InstructorDashboard;
  let fixture: ComponentFixture<InstructorDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstructorDashboard],
      providers: [
        {
          provide: EnrollmentStore,
          useValue: {
            pendingCount: signal(0),
            entities: signal([]),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(InstructorDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
