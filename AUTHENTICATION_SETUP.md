# Authentication Setup Guide

This document describes the authentication system that has been implemented for the Arrow Weight Calculator.

## Features

✅ User signup and login  
✅ JWT token-based authentication  
✅ Protected API routes (builds can only be saved/viewed by authenticated users)  
✅ User-specific builds (each user only sees their own builds)  
✅ Persistent login sessions (tokens stored in localStorage)  
✅ Secure password hashing with bcrypt  
✅ Beautiful login/signup modal UI

## Backend Components

### Models

1. **User Model** (`backend/models/User.js`)
   - Email (unique, required)
   - Password (hashed, required, min 6 characters)
   - Name (optional)
   - Timestamps

2. **Updated ArrowBuild Model** (`backend/models/ArrowBuild.js`)
   - Now includes `user` field linking builds to users
   - Indexed for efficient user-specific queries

### Routes

1. **Auth Routes** (`backend/routes/auth.js`)
   - `POST /api/auth/signup` - Create new user account
   - `POST /api/auth/login` - Login existing user
   - `GET /api/auth/me` - Get current user info (protected)

2. **Protected Build Routes** (`backend/routes/grainCalculator.js`)
   - All build routes now require authentication:
     - `POST /api/save` - Save build (protected)
     - `GET /api/builds` - Get user's builds (protected, filtered by user)
     - `GET /api/builds/:id` - Get specific build (protected, user must own it)
     - `PUT /api/builds/:id` - Update build (protected, user must own it)
     - `DELETE /api/builds/:id` - Delete build (protected, user must own it)
   - `POST /api/calculate` - Calculate grains (public, no auth required)

### Middleware

**Auth Middleware** (`backend/middleware/auth.js`)
- `protect` - Verifies JWT token and attaches user to request
- Returns 401 if token is missing or invalid

### Environment Variables

**Required:**
- `JWT_SECRET` - Secret key for signing JWT tokens (set in Heroku config)
- `MONGO_URI` - MongoDB connection string (already configured)

## Frontend Components

### Context

**AuthContext** (`frontend/src/context/AuthContext.jsx`)
- Manages authentication state (user, token, loading)
- Provides `signup`, `login`, `logout` functions
- Automatically includes token in axios requests
- Persists token in localStorage

### Components

**AuthModal** (`frontend/src/components/AuthModal.jsx`)
- Login/signup modal with beautiful UI
- Form validation
- Error handling
- Theme-aware (light/dark mode support)

### Updated Components

**App.js**
- Wrapped with `AuthProvider`
- Shows login/signup buttons when not authenticated
- Shows user name and logout button when authenticated
- Opens auth modal when needed

**CalculatorTab**
- Checks authentication before saving builds
- Prompts user to log in if not authenticated
- Only fetches builds when authenticated
- Handles auth errors gracefully

**WorkspaceTab**
- Only fetches builds when authenticated
- Shows empty state when not logged in
- Handles auth errors gracefully

## Setup Instructions

### 1. Set JWT Secret on Heroku

```bash
heroku config:set JWT_SECRET=your-super-secret-random-string-here --app arrow-weight-calculator
```

**Important:** Use a long, random string. You can generate one with:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 2. Deploy to Heroku

All code changes are ready. Just commit and push:

```bash
git add .
git commit -m "Add user authentication system"
git push heroku main
```

### 3. Test Authentication

1. Visit https://www.arrowweight.com
2. Click "Sign Up" in the header
3. Create an account with email and password
4. Try saving a build - it should work!
5. Log out and try saving again - it should prompt you to log in
6. Log back in - your builds should still be there

## User Flow

### New User
1. User visits site
2. Clicks "Sign Up" button
3. Enters email, password, and optional name
4. Account created, automatically logged in
5. Can now save, view, and manage builds

### Existing User
1. User visits site
2. Clicks "Log In" button
3. Enters email and password
4. Logged in, sees their saved builds
5. Can save, view, and manage builds

### Not Logged In
1. User can still use the calculator
2. Cannot save builds (prompted to sign up/log in)
3. Cannot see saved builds
4. All calculations still work (public feature)

## Security Features

✅ Passwords hashed with bcrypt (10 rounds)  
✅ JWT tokens with expiration (30 days)  
✅ Tokens stored securely in localStorage  
✅ API routes protected with middleware  
✅ Users can only access their own builds  
✅ Input validation on all forms  
✅ CORS enabled for API requests

## Future Enhancements (Optional)

- Password reset via email
- Email verification
- Remember me option
- Social login (Google, Facebook)
- User profile page
- Build sharing between users
- Public/private build visibility

## Troubleshooting

### "Not authorized" errors
- Check if JWT_SECRET is set in Heroku
- Check if token is being sent in requests
- Token may have expired - try logging out and back in

### Builds not showing
- Make sure you're logged in
- Check browser console for errors
- Verify MongoDB connection is working

### Can't save builds
- Make sure you're logged in
- Check that build name is provided
- Verify all required fields are filled

## API Examples

### Signup
```javascript
POST /api/auth/signup
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe" // optional
}

Response:
{
  "message": "User created successfully",
  "token": "jwt-token-here",
  "user": {
    "id": "...",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

### Login
```javascript
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}

Response: (same as signup)
```

### Get Builds (Protected)
```javascript
GET /api/builds
Headers: Authorization: Bearer <token>

Response:
{
  "items": [...],
  "page": 1,
  "total": 5,
  "hasMore": false
}
```

### Save Build (Protected)
```javascript
POST /api/save
Headers: Authorization: Bearer <token>
{
  "name": "My Arrow Build",
  "components": [...],
  "gpi": 8.5,
  "arrowLength": 30,
  "buildType": "arrow",
  "animal": "deer"
}
```

