import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { EnrollmentRequest } from '../models/enrollment-request.model';

@Injectable({
  providedIn: 'root',
})
export class EnrollmentRequestService {
  private http = inject(HttpClient);

  // final URL: http://localhost:8000/api/enrollment-requests/
  private readonly baseUrl = `${environment.apiBaseUrl}/enrollment-requests/`;

  // Teacher: list all enrollment requests
  getAll(): Observable<EnrollmentRequest[]> {
    return this.http.get<EnrollmentRequest[]>(this.baseUrl);
  }

  // Student: apply for a course
  create(studentId: number, courseId: number): Observable<EnrollmentRequest> {
    const body = { student: studentId, course: courseId };
    return this.http.post<EnrollmentRequest>(this.baseUrl, body);
  }

  // Teacher: confirm/enroll a request
  enroll(id: number): Observable<EnrollmentRequest> {
    return this.http.post<EnrollmentRequest>(`${this.baseUrl}${id}/enroll/`, {});
  }
}
