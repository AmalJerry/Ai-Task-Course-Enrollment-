import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RegisterRequest } from '../../models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  formData: RegisterRequest = {
    username: '',
    email: '',
    password: '',
    password2: '',
    role: 'STUDENT',
    first_name: '',
    last_name: '',
  };

  loading = false;
  errorMessage = '';
  successMessage = '';

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    // Validate passwords match
    if (this.formData.password !== this.formData.password2) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    this.loading = true;

    this.authService.register(this.formData).subscribe({
      next: (response) => {
        this.loading = false;
        console.log('Registration successful', response);
        this.successMessage = 'Registration successful! Redirecting to login...';
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        this.loading = false;
        console.error('Registration error', err);
        
        if (err.error) {
          // Handle field-specific errors
          const errors: string[] = [];
          Object.keys(err.error).forEach(key => {
            if (Array.isArray(err.error[key])) {
              errors.push(`${key}: ${err.error[key].join(', ')}`);
            } else {
              errors.push(`${key}: ${err.error[key]}`);
            }
          });
          this.errorMessage = errors.join(' | ');
        } else {
          this.errorMessage = 'Registration failed. Please try again.';
        }
      },
    });
  }
}
