import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  // Check for role-based access
  const requiredRole = route.data['role'] as 'STUDENT' | 'TEACHER' | undefined;
  
  if (requiredRole) {
    const userRole = authService.getUserRole();
    if (userRole !== requiredRole) {
      // Redirect to appropriate dashboard based on actual role
      if (userRole === 'TEACHER') {
        router.navigate(['/teacher/dashboard']);
      } else if (userRole === 'STUDENT') {
        router.navigate(['/student/dashboard']);
      } else {
        router.navigate(['/login']);
      }
      return false;
    }
  }

  return true;
};
