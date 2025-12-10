import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Course } from '../models/course.model';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  private http = inject(HttpClient);

  // final URL: http://localhost:8000/api/courses/
  private readonly baseUrl = `${environment.apiBaseUrl}/courses/`;

  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.baseUrl);
  }

  getCourse(id: number): Observable<Course> {
    return this.http.get<Course>(`${this.baseUrl}${id}/`);
  }

  createCourse(courseData: any): Observable<Course> {
    return this.http.post<Course>(this.baseUrl, courseData);
  }

  updateCourse(id: number, courseData: any): Observable<Course> {
    return this.http.put<Course>(`${this.baseUrl}${id}/`, courseData);
  }

  deleteCourse(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}${id}/`);
  }
}
