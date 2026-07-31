import { TestBed } from '@angular/core/testing';

import { Enrollment } from './enrollment';

describe('Enrollment', () => {
  let service: Enrollment;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Enrollment);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
