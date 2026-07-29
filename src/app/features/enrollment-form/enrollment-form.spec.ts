import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrollmentForm } from './enrollment-form';

describe('EnrollmentForm', () => {
  let component: EnrollmentForm;
  let fixture: ComponentFixture<EnrollmentForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnrollmentForm],
    }).compileComponents();

    fixture = TestBed.createComponent(EnrollmentForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
