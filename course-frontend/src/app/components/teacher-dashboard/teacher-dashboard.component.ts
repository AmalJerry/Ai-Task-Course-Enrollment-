import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CourseService } from '../../services/course.service';
import { EnrollmentRequestService } from '../../services/enrollment-request.service';
import { Course } from '../../models/course.model';
import { EnrollmentRequest } from '../../models/enrollment-request.model';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './teacher-dashboard.component.html',
  styleUrl: './teacher-dashboard.component.scss',
})
export class TeacherDashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private courseService = inject(CourseService);
  private enrollmentService = inject(EnrollmentRequestService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  currentUser: User | null = null;
  courses: Course[] = [];
  enrollmentRequests: EnrollmentRequest[] = [];
  
  loading = false;
  errorMessage = '';
  successMessage = '';

  // For creating new course
  showCourseForm = false;
  newCourse = {
    name: '',
    code: '',
    description: '',
    max_capacity: 30,
  };

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    console.log('=== Teacher Dashboard Initialized ===');
    console.log('Current User:', this.currentUser);
    console.log('Access Token exists:', !!this.authService.getAccessToken());
    
    // Load data immediately
    this.loadCourses();
    this.loadEnrollmentRequests();
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
        this.courses = courses;
        this.loading = false;
        console.log('  Loading state set to:', this.loading);
        console.log('  Courses array length:', this.courses.length);
        
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

  loadEnrollmentRequests(): void {
    console.log('→ Starting to load enrollment requests...');
    
    this.enrollmentService.getAll().subscribe({
      next: (requests) => {
        console.log('✓ Enrollment requests loaded successfully!');
        console.log('  Total requests:', requests.length);
        console.log('  Requests data:', requests);
        this.enrollmentRequests = requests;
        
        // Manually trigger change detection
        this.cdr.detectChanges();
        console.log('  Enrollment requests array length:', this.enrollmentRequests.length);
        console.log('  Change detection triggered for enrollment requests');
      },
      error: (err) => {
        console.error('✗ Error loading enrollment requests!');
        console.error('  Status:', err.status);
        console.error('  Message:', err.message);
        console.error('  Full error:', err);
        
        if (err.status === 401) {
          console.error('  Authentication required for enrollment requests');
        }
        
        // Trigger change detection even on error
        this.cdr.detectChanges();
      },
    });
  }

  createCourse(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.currentUser) {
      this.errorMessage = 'User not authenticated';
      return;
    }

    const courseData = {
      ...this.newCourse,
      teacher: this.currentUser.id,
    };

    this.courseService.createCourse(courseData).subscribe({
      next: (course) => {
        this.successMessage = `Course "${course.name}" created successfully!`;
        this.showCourseForm = false;
        this.resetCourseForm();
        this.loadCourses();
      },
      error: (err) => {
        console.error('Error creating course', err);
        this.errorMessage = 'Failed to create course';
      },
    });
  }

  resetCourseForm(): void {
    this.newCourse = {
      name: '',
      code: '',
      description: '',
      max_capacity: 30,
    };
  }

  approveEnrollment(request: EnrollmentRequest): void {
    this.errorMessage = '';
    this.successMessage = '';

    this.enrollmentService.enroll(request.id).subscribe({
      next: () => {
        this.successMessage = `Enrollment approved for ${request.student_detail?.username}`;
        this.loadEnrollmentRequests();
        this.loadCourses(); // Refresh to update enrolled_count
      },
      error: (err) => {
        console.error('Error approving enrollment', err);
        if (err.error?.detail) {
          this.errorMessage = err.error.detail;
        } else {
          this.errorMessage = 'Failed to approve enrollment';
        }
      },
    });
  }

  deleteCourse(courseId: number): void {
    if (!confirm('Are you sure you want to delete this course?')) {
      return;
    }

    this.courseService.deleteCourse(courseId).subscribe({
      next: () => {
        this.successMessage = 'Course deleted successfully';
        this.loadCourses();
      },
      error: (err) => {
        console.error('Error deleting course', err);
        this.errorMessage = 'Failed to delete course';
      },
    });
  }

  logout(): void {
    this.authService.logout();
  }

  getPendingRequestsForCourse(courseId: number): number {
    return this.enrollmentRequests.filter(
      req => req.course === courseId && req.status === 'PENDING'
    ).length;
  }
}
