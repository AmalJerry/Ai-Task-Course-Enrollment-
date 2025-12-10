export interface User {
  id: number;
  username: string;
  email: string;
  role: 'STUDENT' | 'TEACHER';
  first_name?: string;
  last_name?: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  password2: string;
  role: 'STUDENT' | 'TEACHER';
  first_name?: string;
  last_name?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: User;
}
