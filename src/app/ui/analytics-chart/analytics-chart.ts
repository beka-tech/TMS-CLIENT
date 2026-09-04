import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { EnrollmentRecord } from '../../models/tms.model';

@Component({
  selector: 'tms-analytics-chart',
  standalone: true,
  templateUrl: './analytics-chart.html',
  styleUrl: './analytics-chart.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalyticsChart {
  // Creates the [data] property used by the parent template
  readonly data = input.required<readonly EnrollmentRecord[]>();
}
