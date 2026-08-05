// import { Component, inject, OnInit } from '@angular/core';
// import { EnrollmentStore } from '../../store/enrollment.store';
// @Component({
//   selector: 'tms-enrollment-list',
//   standalone: true,
//   templateUrl: './enrollment-list.html',
// })
// export class EnrollmentListComponent implements OnInit {
//   store = inject(EnrollmentStore);
//   ngOnInit() {
//     this.store.loadEnrollments();
//   }
//   onApprove(id: string) {
//     this.store.approveEnrollment(id);
//   }
// }

import { Component, viewChild, effect, inject } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { EnrollmentStore } from '../../store/enrollment.store';
import { Enrollment } from '../../models/enrollment.model';
@Component({
  selector: 'tms-enrollment-list',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatSortModule],
  templateUrl: './enrollment-list.html',
  styleUrl: './enrollment-list.scss',
})
export class EnrollmentListComponent {
  store = inject(EnrollmentStore);
  //   ngOnInit() {
  //     this.store.loadEnrollments();
  //   }
  //   onApprove(id: string) {
  //     this.store.approveEnrollment(id);
  displayedColumns = ['studentName', 'courseName', 'status', 'actions'];
  // MatTableDataSource bridges our store data into Material'srendering pipeline
  dataSource = new MatTableDataSource<Enrollment>();
  // viewChild.required() is Angular 22's signal-based replacement for @ViewChild.
  // Unlike the legacy decorator, these are signals — they updatereactively when
  // Angular resolves the template queries. No ngAfterViewInitlifecycle hook needed.
  readonly paginator = viewChild.required(MatPaginator);
  readonly sort = viewChild.required(MatSort);
  constructor() {
    // Effect 1: Push store entities into the Material data source whenever they change
    effect(() => {
      this.dataSource.data = this.store.entities();
    });
    // Effect 2: Wire paginator and sort controls once Angularresolves the view queries
    effect(() => {
      this.dataSource.paginator = this.paginator();
      this.dataSource.sort = this.sort();
    });
    this.store.loadEnrollments();
  }
  // Approve an enrollment
  onApprove(id: string) {
    this.store.approveEnrollment(id);
  }
}
