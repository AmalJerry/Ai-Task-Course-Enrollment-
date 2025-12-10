# Course Enrollment System - Role-Based Authentication Implementation

## Overview
I've successfully transformed your Angular frontend to include role-based authentication with separate dashboards for TEACHER and STUDENT roles. The system now uses JWT authentication that integrates with your Django REST Framework backend.

## 🎯 Key Features Implemented

### 1. **Authentication System**
- **Auth Service** (`auth.service.ts`): Manages login, register, logout, JWT token storage, and user state
- **HTTP Interceptor** (`auth.interceptor.ts`): Automatically adds JWT tokens to all API requests
- **Auth Guard** (`auth.guard.ts`): Protects routes based on authentication and user roles

### 2. **User Registration & Login**
- **Register Component**: New users can sign up and select their role (TEACHER or STUDENT)
- **Login Component**: Users login with username/password, automatically redirected to role-specific dashboard
- JWT tokens stored in localStorage for persistent sessions

### 3. **Role-Based Dashboards**

#### **Teacher Dashboard** (`/teacher/dashboard`)
- ✅ View all courses
- ✅ Create new courses with name, code, description, and capacity
- ✅ Delete courses
- ✅ View all enrollment requests from students
- ✅ Approve pending enrollment requests
- ✅ See real-time enrollment counts and capacity
- ✅ Track pending requests per course

#### **Student Dashboard** (`/student/dashboard`)
- ✅ Browse all available courses
- ✅ Apply for courses
- ✅ View enrollment status (PENDING, ENROLLED, REJECTED)
- ✅ See course capacity and availability
- ✅ Track all personal enrollment requests
- ✅ Prevent duplicate applications

### 4. **Route Protection**
- `/login` - Public (Login page)
- `/register` - Public (Registration page)
- `/teacher/dashboard` - Protected (TEACHER role only)
- `/student/dashboard` - Protected (STUDENT role only)
- Unauthorized access redirects to appropriate dashboard or login

## 📁 New Files Created

```
src/app/
├── models/
│   └── user.model.ts                    # User, LoginRequest, RegisterRequest interfaces
├── services/
│   └── auth.service.ts                  # Authentication service with JWT handling
├── interceptors/
│   └── auth.interceptor.ts              # HTTP interceptor for JWT tokens
├── guards/
│   └── auth.guard.ts                    # Route guard for role-based access
├── components/
│   ├── login/
│   │   ├── login.component.ts
│   │   ├── login.component.html
│   │   └── login.component.scss
│   ├── register/
│   │   ├── register.component.ts
│   │   ├── register.component.html
│   │   └── register.component.scss
│   ├── teacher-dashboard/
│   │   ├── teacher-dashboard.component.ts
│   │   ├── teacher-dashboard.component.html
│   │   └── teacher-dashboard.component.scss
│   └── student-dashboard/
│       ├── student-dashboard.component.ts
│       ├── student-dashboard.component.html
│       └── student-dashboard.component.scss
```

## 📝 Updated Files

```
src/app/
├── app.config.ts                        # Added HTTP interceptor
├── app.routes.ts                        # Updated routing with role-based guards
├── app.html                             # Simplified to router-outlet only
├── services/
│   ├── course.service.ts                # Added create, update, delete methods
│   └── enrollment-request.service.ts    # Already had needed methods
└── models/
    └── enrollment-request.model.ts      # Added student_detail field
```

## 🔐 Backend Integration

The frontend now properly integrates with your Django backend:

### API Endpoints Used:
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login (returns JWT tokens + user data)
- `POST /api/auth/token/refresh/` - Refresh access token
- `GET /api/auth/me/` - Get current user info
- `GET /api/courses/` - List all courses
- `POST /api/courses/` - Create course (TEACHER only)
- `DELETE /api/courses/:id/` - Delete course (TEACHER only)
- `GET /api/enrollment-requests/` - List enrollment requests (filtered by role)
- `POST /api/enrollment-requests/` - Create enrollment request (STUDENT)
- `POST /api/enrollment-requests/:id/enroll/` - Approve enrollment (TEACHER)

### Backend Permissions Respected:
- ✅ `IsTeacherOrReadOnly` - Anyone can view courses, only teachers can modify
- ✅ `IsTeacher` - Teacher-only operations
- ✅ `IsStudent` - Student-only operations
- ✅ Enrollment requests filtered by user role (students see only theirs, teachers see all)

## 🎨 Design Highlights

### Login/Register Pages
- Modern gradient backgrounds (purple theme)
- Clean, centered card layouts
- Form validation
- Error/success message displays
- Smooth transitions and hover effects

### Teacher Dashboard
- Purple gradient header
- Course grid layout with cards
- Inline course creation form
- Enrollment requests table with approve buttons
- Real-time stats (enrolled count, pending requests)
- Responsive design

### Student Dashboard
- Green gradient header (different from teacher)
- Browse courses in grid layout
- Clear enrollment status badges
- "My Enrollments" table showing application history
- Disabled apply button for full courses or existing applications

## 🚀 How to Use

### 1. Start Backend
```bash
cd course_enrollment
python manage.py runserver
```

### 2. Start Frontend
```bash
cd course-frontend
npm start
```

### 3. Test the System

#### Register as Teacher:
1. Navigate to `http://localhost:4200`
2. Click "Register here"
3. Fill form and select "Teacher" role
4. Submit and login
5. You'll be redirected to Teacher Dashboard

#### Register as Student:
1. Register with "Student" role
2. Login
3. You'll be redirected to Student Dashboard

#### Test Flow:
1. **Teacher**: Create a course (e.g., "Web Development 101")
2. **Student**: Apply for the course
3. **Teacher**: View enrollment request and approve it
4. **Student**: See status change to "ENROLLED"

## 🔄 Authentication Flow

1. **User registers** → Backend creates user with role
2. **User logs in** → Backend returns JWT tokens + user data
3. **Frontend stores** → Tokens in localStorage, user in BehaviorSubject
4. **Every API call** → Interceptor adds `Authorization: Bearer <token>`
5. **Token expires** → Interceptor catches 401, refreshes token, retries request
6. **User navigates** → Guard checks authentication and role, allows/denies access

## 📊 State Management

- **Current User**: Managed via `BehaviorSubject` in `AuthService`
- **JWT Tokens**: Stored in `localStorage`
- **User State**: Persisted across page refreshes
- **Automatic Logout**: On token refresh failure

## 🛡️ Security Features

- ✅ JWT token-based authentication
- ✅ Automatic token refresh on expiry
- ✅ Role-based route protection
- ✅ HTTP-only authorization headers
- ✅ Logout clears all tokens
- ✅ Guards prevent unauthorized access

## 🎯 Next Steps (Optional Enhancements)

1. **Password Reset**: Add forgot password functionality
2. **Profile Management**: Allow users to update their profile
3. **Course Editing**: Add update functionality for teachers
4. **Search & Filter**: Add search for courses and requests
5. **Pagination**: Add pagination for large datasets
6. **Real-time Updates**: Use WebSockets for live notifications
7. **Course Details Page**: Dedicated page for each course
8. **Email Notifications**: Notify students when enrollment is approved

## ✅ Testing Checklist

- [ ] Register as TEACHER
- [ ] Register as STUDENT
- [ ] Login as TEACHER → See Teacher Dashboard
- [ ] Login as STUDENT → See Student Dashboard
- [ ] Teacher creates a course
- [ ] Student applies for course
- [ ] Teacher approves enrollment
- [ ] Try accessing `/teacher/dashboard` as student → Should redirect
- [ ] Try accessing `/student/dashboard` as teacher → Should redirect
- [ ] Logout and verify redirect to login
- [ ] Refresh page while logged in → Should maintain session

---

**All components are fully implemented and ready to use!** The system follows Angular best practices with standalone components, modern reactive patterns, and clean separation of concerns.
