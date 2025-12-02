import type { Course } from './course.model';

export type EnrollmentStatus = 'PENDING' | 'ENROLLED' | 'REJECTED';

export interface EnrollmentRequest {
  id: number;
  student: number;          // student user ID
  course: number;           // course ID
  status: EnrollmentStatus; 
  created_at: string;
  updated_at: string;
  is_waitlisted: boolean;   // comes from backend
  course_detail: Course;    // nested course info
}
