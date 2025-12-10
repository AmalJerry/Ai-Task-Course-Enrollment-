import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CourseService } from '../../services/course.service';
import { EnrollmentRequestService } from '../../services/enrollment-request.service';
import { Course } from '../../models/course.model';
import { EnrollmentRequest } from '../../models/enrollment-request.model';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-dashboard.component.html',
  styleUrl: './student-dashboard.component.scss',
})
export class StudentDashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private courseService = inject(CourseService);
  private enrollmentService = inject(EnrollmentRequestService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  currentUser: User | null = null;
  availableCourses: Course[] = [];
  myEnrollments: EnrollmentRequest[] = [];
  
  loading = false;
  errorMessage = '';
  successMessage = '';

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    console.log('=== Student Dashboard Initialized ===');
    console.log('Current User:', this.currentUser);
    console.log('Access Token exists:', !!this.authService.getAccessToken());
    
    // Load data immediately
    this.loadCourses();
    this.loadMyEnrollments();
  }

  loadCourses(): void {
    console.log('→ Starting to load courses...');
    this.loading = true;
    this.errorMessage = '';
    console.log('  Loading state set to:', this.loading);
    
    this.courseService.getCourses().subscribe({
      next: (courses) => {
        console.log('✓ Courses loaded successfully!');
        console.log('  Total courses:', courses.length);
        console.log('  Courses data:', courses);
        this.availableCourses = courses;
        this.loading = false;
        console.log('  Loading state set to:', this.loading);
        console.log('  Available courses length:', this.availableCourses.length);
        
        // Manually trigger change detection
        this.cdr.detectChanges();
        console.log('  Change detection triggered');
      },
      error: (err) => {
        console.error('✗ Error loading courses!');
        console.error('  Status:', err.status);
        console.error('  Message:', err.message);
        console.error('  Full error:', err);
        
        this.loading = false;
        this.cdr.detectChanges();
        
        if (err.status === 0) {
          this.errorMessage = 'Cannot connect to server. Please ensure backend is running on http://127.0.0.1:8000';
        } else if (err.status === 401) {
          this.errorMessage = 'Not authenticated. Please login again.';
          setTimeout(() => this.authService.logout(), 2000);
        } else if (err.status === 403) {
          this.errorMessage = 'Access forbidden. Please check your permissions.';
        } else {
          this.errorMessage = `Failed to load courses: ${err.statusText || err.message || 'Unknown error'}`;
        }
      },
    });
  }

  loadMyEnrollments(): void {
    console.log('→ Starting to load my enrollments...');
    
    this.enrollmentService.getAll().subscribe({
      next: (enrollments) => {
        console.log('✓ Enrollments loaded successfully!');
        console.log('  Total enrollments:', enrollments.length);
        console.log('  Enrollments data:', enrollments);
        this.myEnrollments = enrollments;
        
        // Manually trigger change detection
        this.cdr.detectChanges();
        console.log('  My enrollments array length:', this.myEnrollments.length);
        console.log('  Change detection triggered for enrollments');
      },
      error: (err) => {
        console.error('✗ Error loading enrollments!');
        console.error('  Status:', err.status);
        console.error('  Message:', err.message);
        console.error('  Full error:', err);
        
        // Trigger change detection even on error
        this.cdr.detectChanges();
      },
    });
  }

  isAlreadyEnrolled(courseId: number): boolean {
    return this.myEnrollments.some(
      enrollment => enrollment.course === courseId
    );
  }

  getEnrollmentStatus(courseId: number): string | null {
    const enrollment = this.myEnrollments.find(e => e.course === courseId);
    return enrollment ? enrollment.status : null;
  }

  applyForCourse(course: Course): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.currentUser) {
      this.errorMessage = 'You must be logged in to apply';
      return;
    }

    if (this.isAlreadyEnrolled(course.id)) {
      this.errorMessage = 'You have already applied for this course';
      return;
    }

    this.enrollmentService.create(this.currentUser.id, course.id).subscribe({
      next: (enrollment) => {
        this.successMessage = `Successfully applied for "${course.name}"!`;
        this.loadMyEnrollments();
      },
      error: (err) => {
        console.error('Error applying for course', err);
        if (err.error?.detail) {
          this.errorMessage = err.error.detail;
        } else if (err.error?.non_field_errors) {
          this.errorMessage = err.error.non_field_errors.join(', ');
        } else {
          this.errorMessage = 'Failed to apply for course';
        }
      },
    });
  }

  isCourseAvailable(course: Course): boolean {
    return course.enrolled_count < course.max_capacity;
  }

  logout(): void {
    this.authService.logout();
  }
}
