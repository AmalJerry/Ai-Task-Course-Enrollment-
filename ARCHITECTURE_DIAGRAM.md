# Authentication & Authorization Flow

## 🔄 Complete Authentication Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER REGISTRATION                            │
└─────────────────────────────────────────────────────────────────────┘

User fills registration form (username, email, password, ROLE)
                     ↓
Frontend → POST /api/auth/register/ → Backend
                     ↓
Backend creates User with role (TEACHER or STUDENT)
                     ↓
Success → Redirect to Login Page


┌─────────────────────────────────────────────────────────────────────┐
│                            USER LOGIN                                │
└─────────────────────────────────────────────────────────────────────┘

User enters username & password
                     ↓
Frontend → POST /api/auth/login/ → Backend
                     ↓
Backend validates credentials
                     ↓
Backend returns: {
    access: "jwt_access_token",
    refresh: "jwt_refresh_token",
    user: { id, username, email, role }
}
                     ↓
Frontend stores in localStorage:
  - access_token
  - refresh_token
  - user object
                     ↓
Frontend updates BehaviorSubject (currentUser$)
                     ↓
             Route Guard Checks Role
                     ↓
    ┌───────────────┴───────────────┐
    │                               │
role === TEACHER              role === STUDENT
    │                               │
    ↓                               ↓
Redirect to                   Redirect to
/teacher/dashboard            /student/dashboard


┌─────────────────────────────────────────────────────────────────────┐
│                         API REQUEST FLOW                             │
└─────────────────────────────────────────────────────────────────────┘

User performs action (e.g., create course, apply for course)
                     ↓
Frontend service makes HTTP request
                     ↓
HTTP Interceptor (authInterceptor) adds header:
    Authorization: Bearer <access_token>
                     ↓
Request sent to Backend API
                     ↓
Backend verifies JWT token
                     ↓
Backend checks user role permissions
                     ↓
    ┌───────────────┴───────────────┐
    │                               │
Valid Token                    Invalid/Expired Token
& Correct Role                      │
    │                               ↓
    ↓                    Return 401 Unauthorized
Success Response                    ↓
    │                    Interceptor catches error
    ↓                               ↓
Return data to                Try refresh token
Frontend                            ↓
                         POST /api/auth/token/refresh/
                                    ↓
                    ┌───────────────┴───────────────┐
                    │                               │
            Refresh Success                  Refresh Failed
                    │                               │
                    ↓                               ↓
        Store new access_token                   Logout user
        Retry original request               Clear localStorage
                    │                      Redirect to /login
                    ↓
            Return data to Frontend


┌─────────────────────────────────────────────────────────────────────┐
│                        ROUTE PROTECTION                              │
└─────────────────────────────────────────────────────────────────────┘

User navigates to protected route
                     ↓
Auth Guard (authGuard) executes
                     ↓
        Check if user is authenticated
                     ↓
    ┌───────────────┴───────────────┐
    │                               │
Not Authenticated              Authenticated
    │                               │
    ↓                               ↓
Redirect to /login          Check required role
                                    ↓
                        ┌───────────┴───────────┐
                        │                       │
                Role Matches             Role Mismatch
                        │                       │
                        ↓                       ↓
                Allow Access            Redirect to correct
                Show Component          dashboard based on
                                       actual user role


┌─────────────────────────────────────────────────────────────────────┐
│                            LOGOUT FLOW                               │
└─────────────────────────────────────────────────────────────────────┘

User clicks Logout button
                     ↓
AuthService.logout() called
                     ↓
Clear localStorage:
  - Remove access_token
  - Remove refresh_token
  - Remove user object
                     ↓
Update BehaviorSubject: currentUser$ = null
                     ↓
Redirect to /login
```

---

## 🎯 Role-Based Access Control

### Teacher Permissions

| Action | Endpoint | Method | Permission |
|--------|----------|--------|------------|
| View all courses | `/api/courses/` | GET | AllowAny |
| Create course | `/api/courses/` | POST | IsTeacher |
| Update course | `/api/courses/:id/` | PUT | IsTeacher |
| Delete course | `/api/courses/:id/` | DELETE | IsTeacher |
| View all enrollments | `/api/enrollment-requests/` | GET | IsAuthenticated |
| Approve enrollment | `/api/enrollment-requests/:id/enroll/` | POST | IsTeacher |

### Student Permissions

| Action | Endpoint | Method | Permission |
|--------|----------|--------|------------|
| View all courses | `/api/courses/` | GET | AllowAny |
| View my enrollments | `/api/enrollment-requests/` | GET | IsAuthenticated |
| Apply for course | `/api/enrollment-requests/` | POST | IsStudent |

---

## 🔐 Security Layers

```
┌─────────────────────────────────────────────────────────────────┐
│                      FRONTEND SECURITY                           │
├─────────────────────────────────────────────────────────────────┤
│ 1. Route Guards (authGuard)                                     │
│    - Prevents unauthorized route access                         │
│    - Redirects based on authentication state                    │
│                                                                  │
│ 2. HTTP Interceptor (authInterceptor)                          │
│    - Adds JWT token to all requests                            │
│    - Handles token refresh automatically                        │
│    - Logs out on authentication failure                         │
│                                                                  │
│ 3. AuthService                                                   │
│    - Manages user state                                          │
│    - Controls token storage                                      │
│    - Provides authentication status                             │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND SECURITY                            │
├─────────────────────────────────────────────────────────────────┤
│ 1. JWT Authentication                                            │
│    - Token-based stateless authentication                       │
│    - Access tokens (short-lived)                                │
│    - Refresh tokens (longer-lived)                              │
│                                                                  │
│ 2. Custom Permissions                                            │
│    - IsTeacher: Only teachers can access                        │
│    - IsStudent: Only students can access                        │
│    - IsTeacherOrReadOnly: Teachers write, all read             │
│                                                                  │
│ 3. Django REST Framework                                         │
│    - Built-in authentication classes                            │
│    - Permission classes on viewsets                             │
│    - CORS protection                                             │
│                                                                  │
│ 4. QuerySet Filtering                                            │
│    - Students see only their enrollments                        │
│    - Teachers see all enrollments                               │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 User State Management

```
┌──────────────────────────────────────────────────────────────┐
│                    AuthService State                          │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  currentUserSubject (BehaviorSubject<User | null>)          │
│         ↓                                                     │
│  currentUser$ (Observable<User | null>)                      │
│         ↓                                                     │
│  Components subscribe to get user updates                    │
│                                                               │
├──────────────────────────────────────────────────────────────┤
│                  localStorage Storage                         │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  - access_token    → JWT access token                        │
│  - refresh_token   → JWT refresh token                       │
│  - user            → JSON stringified user object            │
│                                                               │
└──────────────────────────────────────────────────────────────┘

On App Initialization:
  └─→ Check localStorage for 'user'
      └─→ If exists: Parse and load into BehaviorSubject
          └─→ User stays logged in across page refreshes
```

---

## 🎭 User Roles & Routes Matrix

| Route | Anonymous | STUDENT | TEACHER |
|-------|-----------|---------|---------|
| `/login` | ✅ Allow | ✅ Allow | ✅ Allow |
| `/register` | ✅ Allow | ✅ Allow | ✅ Allow |
| `/student/dashboard` | ❌ Redirect to /login | ✅ Allow | ❌ Redirect to /teacher/dashboard |
| `/teacher/dashboard` | ❌ Redirect to /login | ❌ Redirect to /student/dashboard | ✅ Allow |

---

## 🔄 Token Lifecycle

```
Access Token (Short-lived, ~5-15 minutes)
├─→ Used for API requests
├─→ Stored in localStorage
├─→ Added to Authorization header
└─→ Expires quickly for security

Refresh Token (Long-lived, ~1-7 days)
├─→ Used to get new access token
├─→ Stored in localStorage
├─→ Not sent with every request
└─→ Only used when access token expires

Token Refresh Flow:
  API Request → 401 Error → Use Refresh Token → Get New Access Token → Retry Request
                              ↓
                       If refresh fails → Logout User
```

---

## 🛡️ Security Best Practices Implemented

✅ **JWT Tokens** - Stateless authentication  
✅ **Role-Based Access Control** - Different permissions per role  
✅ **Route Guards** - Client-side protection  
✅ **HTTP Interceptor** - Automatic token injection  
✅ **Token Refresh** - Seamless token renewal  
✅ **CORS Configuration** - Cross-origin protection  
✅ **Password Validation** - Backend enforces strong passwords  
✅ **Logout Cleanup** - Complete session clearing  
✅ **Protected Endpoints** - Backend permission classes  

---

This architecture ensures secure, role-based access control throughout the entire application!
