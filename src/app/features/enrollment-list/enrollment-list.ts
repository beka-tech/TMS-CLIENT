import { Component, inject, OnInit } from '@angular/core';
import { EnrollmentStore } from '../../store/enrollment.store';
@Component({
  selector: 'tms-enrollment-list',
  standalone: true,
  templateUrl: './enrollment-list.html',
})
export class EnrollmentListComponent implements OnInit {
  store = inject(EnrollmentStore);
  ngOnInit() {
    this.store.loadEnrollments();
  }
  onApprove(id: string) {
    this.store.approveEnrollment(id);
  }
}
