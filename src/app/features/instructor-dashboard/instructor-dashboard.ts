import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { AnalyticsChart } from '../../ui/analytics-chart/analytics-chart';
import { EnrollmentStore } from '../../store/enrollment.store';

@Component({
  selector: 'tms-instructor-dashboard',
  standalone: true,

  // This is the important fix
  imports: [AnalyticsChart],

  templateUrl: './instructor-dashboard.html',
  styleUrl: './instructor-dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstructorDashboard {
  protected readonly store = inject(EnrollmentStore);
}
