# Backend API Test Instructions

## Quick Backend Test

Open your browser and test these URLs directly (while Django server is running):

### 1. Test Courses API (Should work without authentication)
```
http://127.0.0.1:8000/api/courses/
```
**Expected Result:** JSON array of courses (even if empty: `[]`)

### 2. Test Auth API
```
http://127.0.0.1:8000/api/auth/me/
```
**Expected Result:** 401 Unauthorized (this is correct - requires login)

### 3. Check Django Admin
```
http://127.0.0.1:8000/admin/
```
- Login with superuser credentials
- Check if any courses exist in the database

## Console Debug Checklist

After logging into the frontend, open Browser Dev Tools (F12) and check:

### Console Tab - Look for:
```
=== Student/Teacher Dashboard Initialized ===
Current User: {id, username, email, role}
Access Token exists: true
→ Starting to load courses...
✓ Courses loaded successfully!
  Total courses: X
```

### Network Tab - Look for:
1. Request to: `http://127.0.0.1:8000/api/courses/`
   - Status should be: **200 OK**
   - Response should show course data

2. Check Request Headers:
   - Should include: `Authorization: Bearer <token>`

## Common Issues & Solutions

### Issue: Status 0 (CORS Error)
**Symptom:** Console shows "Cannot connect to server"
**Solution:** 
- Ensure Django server is running
- Check CORS settings in `settings.py`

### Issue: Empty array []
**Symptom:** Loads successfully but no courses shown
**Solution:**
- Create a course as teacher first
- Check database for existing courses

### Issue: 401 Unauthorized
**Symptom:** "Not authenticated" error
**Solution:**
- Logout and login again
- Check if tokens are stored in localStorage

### Issue: Still shows "Loading courses..."
**Symptom:** Loading indicator never disappears
**Solution:**
- Check browser console for errors
- Verify API endpoint is correct
- Check network tab for failed requests
