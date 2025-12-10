# Quick Start Guide - Course Enrollment System

## 🚀 Getting Started

### Prerequisites
- Python 3.8+ installed
- Node.js 18+ and npm installed
- Angular CLI installed globally: `npm install -g @angular/cli`

### Backend Setup (Django)

1. **Navigate to backend directory**
   ```powershell
   cd "c:\Users\amalj\Desktop\Cydez\Ai Task\course_enrollment"
   ```

2. **Install Python dependencies** (if not already done)
   ```powershell
   pip install -r requirements.txt
   ```

3. **Run migrations** (if not already done)
   ```powershell
   python manage.py migrate
   ```

4. **Create superuser** (optional, for admin panel access)
   ```powershell
   python manage.py createsuperuser
   ```

5. **Start the backend server**
   ```powershell
   python manage.py runserver
   ```
   
   Backend will be available at: `http://localhost:8000`

### Frontend Setup (Angular)

1. **Navigate to frontend directory**
   ```powershell
   cd "c:\Users\amalj\Desktop\Cydez\Ai Task\course-frontend"
   ```

2. **Install npm dependencies** (if not already done)
   ```powershell
   npm install
   ```

3. **Start the development server**
   ```powershell
   npm start
   ```
   or
   ```powershell
   ng serve
   ```
   
   Frontend will be available at: `http://localhost:4200`

---

## 📖 User Guide

### First Time Setup

#### 1. Register a Teacher Account
1. Open browser and go to `http://localhost:4200`
2. You'll be redirected to the login page
3. Click **"Register here"**
4. Fill in the registration form:
   - Username: `teacher1`
   - Email: `teacher@example.com`
   - Role: Select **"Teacher"** from dropdown
   - Password: (minimum 8 characters)
   - Confirm Password: (must match)
5. Click **"Register"**
6. You'll see success message and be redirected to login

#### 2. Login as Teacher
1. Enter username: `teacher1`
2. Enter password
3. Click **"Login"**
4. You'll be automatically redirected to **Teacher Dashboard**

#### 3. Create Courses (Teacher Dashboard)
1. Click **"+ Create New Course"** button
2. Fill in course details:
   - Course Name: `Introduction to Programming`
   - Course Code: `CS101`
   - Description: `Learn the basics of programming`
   - Maximum Capacity: `30`
3. Click **"Create Course"**
4. Course will appear in the courses grid

#### 4. Register a Student Account
1. Open a new incognito/private browser window (or logout first)
2. Go to `http://localhost:4200`
3. Click **"Register here"**
4. Fill in the form:
   - Username: `student1`
   - Email: `student@example.com`
   - Role: Select **"Student"** from dropdown
   - Password: (minimum 8 characters)
5. Click **"Register"**

#### 5. Login as Student
1. Enter username: `student1`
2. Enter password
3. Click **"Login"**
4. You'll be automatically redirected to **Student Dashboard**

#### 6. Apply for Courses (Student Dashboard)
1. Browse available courses in the "Available Courses" section
2. Click **"Apply Now"** on any course
3. You'll see a success message
4. The course will now appear in "My Enrollments" with status **"PENDING"**

#### 7. Approve Enrollments (Teacher Dashboard)
1. Switch back to teacher account (or login in another window)
2. Scroll to **"Enrollment Requests"** section
3. You'll see the student's application with status "PENDING"
4. Click **"Approve"** button
5. Status will change to **"ENROLLED"**
6. The course's enrolled count will increase

#### 8. Check Enrollment Status (Student Dashboard)
1. Switch back to student account
2. Refresh the page
3. In "My Enrollments", status will now show **"ENROLLED"**

---

## 🎯 Features to Test

### Teacher Features
- ✅ Create multiple courses
- ✅ View all courses with enrollment stats
- ✅ Delete courses (warning: confirm dialog)
- ✅ View all enrollment requests from all students
- ✅ Approve pending enrollment requests
- ✅ See pending request count per course
- ✅ Logout functionality

### Student Features
- ✅ Browse all available courses
- ✅ Apply for multiple courses
- ✅ View all your enrollment requests with status
- ✅ See course capacity (enrolled/max)
- ✅ Cannot apply for same course twice
- ✅ Cannot apply for full courses
- ✅ Logout functionality

### Authentication & Security
- ✅ Role-based access (students can't access teacher dashboard)
- ✅ JWT token authentication
- ✅ Persistent login (refresh page stays logged in)
- ✅ Automatic token refresh
- ✅ Logout clears session

---

## 🎨 UI Overview

### Login Page (`/login`)
- Purple gradient background
- Clean centered form
- Link to registration

### Register Page (`/register`)
- Similar purple theme
- Role selection dropdown (Student/Teacher)
- Form validation

### Teacher Dashboard (`/teacher/dashboard`)
- Purple gradient header with welcome message
- Two main sections:
  1. **My Courses** - Grid of course cards with stats
  2. **Enrollment Requests** - Table with approve buttons
- Logout button in header

### Student Dashboard (`/student/dashboard`)
- Green gradient header (different from teacher)
- Two main sections:
  1. **My Enrollments** - Table showing application history
  2. **Available Courses** - Grid of courses with apply buttons
- Status badges for enrollment states
- Logout button in header

---

## 🔐 Test Accounts (After Creation)

| Role | Username | Dashboard URL |
|------|----------|---------------|
| Teacher | teacher1 | `http://localhost:4200/teacher/dashboard` |
| Student | student1 | `http://localhost:4200/student/dashboard` |

---

## 🐛 Troubleshooting

### Backend Issues

**Problem**: "Port 8000 is already in use"
```powershell
# Kill the process using port 8000
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

**Problem**: "No module named 'rest_framework'"
```powershell
pip install djangorestframework
```

**Problem**: "No module named 'corsheaders'"
```powershell
pip install django-cors-headers
```

### Frontend Issues

**Problem**: "Port 4200 is already in use"
```powershell
# Start on different port
ng serve --port 4201
```

**Problem**: Login redirects to login again
- Check browser console for errors
- Verify backend is running on port 8000
- Check `environment.ts` has correct API URL

**Problem**: "403 Forbidden" or "401 Unauthorized"
- Logout and login again
- Clear browser localStorage
- Check CORS settings in Django settings.py

### Common Issues

**Problem**: Can't create course as teacher
- Verify you registered with TEACHER role
- Check browser Network tab for API errors
- Ensure backend permissions are correct

**Problem**: Student can access teacher dashboard
- Clear browser cache and localStorage
- Logout and login again
- Check auth.guard.ts is applied to routes

---

## 📞 API Endpoints Reference

### Authentication
- `POST /api/auth/register/` - Register new user
- `POST /api/auth/login/` - Login user
- `GET /api/auth/me/` - Get current user info
- `POST /api/auth/token/refresh/` - Refresh JWT token

### Courses
- `GET /api/courses/` - List all courses (public)
- `POST /api/courses/` - Create course (TEACHER only)
- `GET /api/courses/:id/` - Get course details
- `PUT /api/courses/:id/` - Update course (TEACHER only)
- `DELETE /api/courses/:id/` - Delete course (TEACHER only)

### Enrollment Requests
- `GET /api/enrollment-requests/` - List requests (filtered by role)
- `POST /api/enrollment-requests/` - Create request (STUDENT only)
- `POST /api/enrollment-requests/:id/enroll/` - Approve (TEACHER only)

---

## 📚 Project Structure

```
course_enrollment/          # Django Backend
├── accounts/               # User authentication app
├── courses/                # Courses and enrollments app
├── course_enrollment/      # Project settings
└── db.sqlite3              # Database

course-frontend/            # Angular Frontend
├── src/app/
│   ├── components/         # UI components
│   │   ├── login/
│   │   ├── register/
│   │   ├── teacher-dashboard/
│   │   └── student-dashboard/
│   ├── services/           # API services
│   ├── guards/             # Route guards
│   ├── interceptors/       # HTTP interceptors
│   └── models/             # TypeScript interfaces
└── package.json
```

---

## ✅ Success Checklist

- [ ] Backend running on port 8000
- [ ] Frontend running on port 4200
- [ ] Registered teacher account
- [ ] Registered student account
- [ ] Created at least one course as teacher
- [ ] Applied for course as student
- [ ] Approved enrollment as teacher
- [ ] Verified enrollment status as student
- [ ] Tested logout functionality
- [ ] Tested role-based access restrictions

---

**🎉 Congratulations!** Your role-based course enrollment system is now fully functional!
