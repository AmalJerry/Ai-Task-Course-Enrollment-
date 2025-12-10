import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { TeacherDashboardComponent } from './components/teacher-dashboard/teacher-dashboard.component';
import { StudentDashboardComponent } from './components/student-dashboard/student-dashboard.component';
import { authGuard } from './guards/auth.guard';

export const appRoutes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'teacher/dashboard', 
    component: TeacherDashboardComponent,
    canActivate: [authGuard],
    data: { role: 'TEACHER' }
  },
  { 
    path: 'student/dashboard', 
    component: StudentDashboardComponent,
    canActivate: [authGuard],
    data: { role: 'STUDENT' }
  },
  { path: '**', redirectTo: '/login' },
];
