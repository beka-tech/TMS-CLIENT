import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsChart } from './analytics-chart';

describe('AnalyticsChart', () => {
  let component: AnalyticsChart;
  let fixture: ComponentFixture<AnalyticsChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalyticsChart],
    }).compileComponents();

    fixture = TestBed.createComponent(AnalyticsChart);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
