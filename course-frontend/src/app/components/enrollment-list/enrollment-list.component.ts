import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnrollmentRequestService } from '../../services/enrollment-request.service';
import { EnrollmentRequest } from '../../models/enrollment-request.model';

@Component({
  selector: 'app-enrollment-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './enrollment-list.component.html',
  styleUrl: './enrollment-list.component.scss',
})
export class EnrollmentListComponent implements OnInit {
  private enrollmentService = inject(EnrollmentRequestService);

  requests: EnrollmentRequest[] = [];
  loading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.fetchRequests();
  }

  fetchRequests(): void {
    this.loading = true;
    this.errorMessage = '';

    this.enrollmentService.getAll().subscribe({
      next: (data) => {
        this.requests = data;
        this.loading = false;
        console.log('Enrollment requests:', data); // helpful for debugging
      },
      error: (err) => {
        console.error('Error loading enrollment requests', err);
        this.errorMessage = 'Failed to load enrollment requests.';
        this.loading = false;
      },
    });
  }

  enroll(req: EnrollmentRequest): void {
    this.errorMessage = '';
    this.enrollmentService.enroll(req.id).subscribe({
      next: () => {
        this.fetchRequests(); // refresh table
      },
      error: (err) => {
        console.error('Error enrolling student', err);
        if (err.error?.detail) {
          this.errorMessage = err.error.detail;
        } else {
          this.errorMessage = 'Failed to enroll student.';
        }
      },
    });
  }
}
