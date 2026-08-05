import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructorDashboard } from './instructor-dashboard';

describe('InstructorDashboard', () => {
  let component: InstructorDashboard;
  let fixture: ComponentFixture<InstructorDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstructorDashboard],
    }).compileComponents();

    fixture = TestBed.createComponent(InstructorDashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
