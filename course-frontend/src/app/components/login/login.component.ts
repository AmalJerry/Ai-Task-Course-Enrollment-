import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  credentials: LoginRequest = {
    username: '',
    password: '',
  };

  loading = false;
  errorMessage = '';

  onSubmit(): void {
    this.errorMessage = '';
    this.loading = true;

    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        this.loading = false;
        console.log('Login successful', response);
        console.log('User stored in localStorage');
        console.log('Access token:', this.authService.getAccessToken());
        
        // Navigate without reload - auth state is already set in login()
        if (response.user.role === 'TEACHER') {
          this.router.navigate(['/teacher/dashboard'], { replaceUrl: true });
        } else if (response.user.role === 'STUDENT') {
          this.router.navigate(['/student/dashboard'], { replaceUrl: true });
        }
      },
      error: (err) => {
        this.loading = false;
        console.error('Login error', err);
        
        if (err.error?.detail) {
          this.errorMessage = err.error.detail;
        } else if (err.error?.non_field_errors) {
          this.errorMessage = err.error.non_field_errors.join(', ');
        } else {
          this.errorMessage = 'Invalid username or password';
        }
      },
    });
  }
}
