import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CourseService } from '../../services/course.service';
import { EnrollmentRequestService } from '../../services/enrollment-request.service';
import { Course } from '../../models/course.model';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './course-list.component.html',
  styleUrl: './course-list.component.scss',
})
export class CourseListComponent implements OnInit {
  private courseService = inject(CourseService);
  private enrollmentService = inject(EnrollmentRequestService);

  courses: Course[] = [];
  loading = false;
  errorMessage = '';
  successMessage = '';

  studentId: number | null = null;

  ngOnInit(): void {
    // This runs automatically when you navigate to the student route.
    this.fetchCourses();
  }

  fetchCourses(): void {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.courseService.getCourses().subscribe({
      next: (courses) => {
        this.courses = courses;
        this.loading = false;
        console.log('Courses loaded:', courses);
      },
      error: (err) => {
        console.error('Error loading courses', err);
        this.errorMessage = 'Failed to load courses. Please check your API.';
        this.loading = false;
      },
    });
  }

  apply(course: Course): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.studentId) {
      this.errorMessage = 'Please enter a Student ID.';
      return;
    }

    this.enrollmentService.create(this.studentId, course.id).subscribe({
      next: (res) => {
        this.successMessage = `Applied to "${res.course_detail.name}" (status: ${res.status}).`;
      },
      error: (err) => {
        console.error('Error applying for course', err);
        if (err.error?.detail) {
          this.errorMessage = err.error.detail;
        } else {
          this.errorMessage = 'Failed to apply for the course.';
        }
      },
    });
  }
}
