import { Routes } from '@angular/router';
import { CourseListComponent } from './components/course-list/course-list.component';
import { EnrollmentListComponent } from './components/enrollment-list/enrollment-list.component';

export const appRoutes: Routes = [
  { path: '', component: CourseListComponent },        // student page
  { path: 'teacher', component: EnrollmentListComponent }, // teacher page
  { path: '**', redirectTo: '' },
];
