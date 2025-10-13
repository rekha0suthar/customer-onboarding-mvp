# Customer Onboarding MVP

A full-stack customer onboarding application with role-based access control (RBAC), built with React, Node.js, Express, and PostgreSQL.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Security](#security)
- [Technology Stack](#technology-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [User Roles](#user-roles)
- [Development](#development)
- [Production Deployment](#production-deployment)

---

## 🎯 Overview

This application provides a complete customer onboarding solution with multi-step profile management, document upload capabilities, and an administrative dashboard for oversight.

### Key Highlights:
- **Full-stack** React + Node.js application
- **Role-Based Access Control** (Broker & Admin roles)
- **JWT Authentication** with secure token handling
- **Document Management** with file upload/download
- **Onboarding Workflow** with step tracking
- **Admin Dashboard** for user and customer management
- **RESTful API** with comprehensive validation
- **Mobile-Responsive** UI with modern design

---

## 🏗️ Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
│  ┌────────────────────────────────────────────────────────┐    │
│  │         React Frontend (Vite + Tailwind CSS)            │    │
│  │  ┌──────────┐  ┌──────────┐  ┌─────────────────────┐  │    │
│  │  │  Pages   │  │Components│  │  Context (Auth)     │  │    │
│  │  │          │  │          │  │                     │  │    │
│  │  │ Login    │  │ Navbar   │  │ - Authentication    │  │    │
│  │  │ Register │  │ Loading  │  │ - User State Mgmt   │  │    │
│  │  │ Dashboard│  │ Protected│  │ - Token Management  │  │    │
│  │  │ Profile  │  │ Routes   │  │                     │  │    │
│  │  │ Documents│  │          │  │                     │  │    │
│  │  │ Admin    │  │          │  │                     │  │    │
│  │  └──────────┘  └──────────┘  └─────────────────────┘  │    │
│  │                                                          │    │
│  │  ┌────────────────────────────────────────────────┐    │    │
│  │  │         Services (API Clients)                  │    │    │
│  │  │  - Axios with interceptors                     │    │    │
│  │  │  - Auth API, Customer API, Document API        │    │    │
│  │  │  - Admin API                                   │    │    │
│  │  └────────────────────────────────────────────────┘    │    │
│  └────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              ▼ HTTP/HTTPS
┌─────────────────────────────────────────────────────────────────┐
│                         SERVER LAYER                             │
│  ┌────────────────────────────────────────────────────────┐    │
│  │     Express.js Backend (Node.js)                        │    │
│  │                                                          │    │
│  │  ┌──────────────────────────────────────────────────┐  │    │
│  │  │              Middleware Stack                     │  │    │
│  │  │  1. CORS                                         │  │    │
│  │  │  2. Body Parser (JSON/URL-encoded)              │  │    │
│  │  │  3. Static File Serving (/uploads)              │  │    │
│  │  │  4. Request Logging                             │  │    │
│  │  │  5. Authentication (JWT verification)           │  │    │
│  │  │  6. RBAC (Role-based authorization)             │  │    │
│  │  │  7. Validation (express-validator)              │  │    │
│  │  │  8. File Upload (Multer)                        │  │    │
│  │  │  9. Error Handling                              │  │    │
│  │  └──────────────────────────────────────────────────┘  │    │
│  │                                                          │    │
│  │  ┌──────────────────────────────────────────────────┐  │    │
│  │  │                  API Routes                       │  │    │
│  │  │                                                   │  │    │
│  │  │  /api/auth       → Authentication                │  │    │
│  │  │  /api/customers  → Customer Management           │  │    │
│  │  │  /api/documents  → Document Operations           │  │    │
│  │  │  /api/admin      → Admin Dashboard               │  │    │
│  │  └──────────────────────────────────────────────────┘  │    │
│  │                                                          │    │
│  │  ┌──────────────────────────────────────────────────┐  │    │
│  │  │                 Controllers                       │  │    │
│  │  │  - Business Logic                                │  │    │
│  │  │  - Request/Response Handling                     │  │    │
│  │  │  - Error Management                              │  │    │
│  │  └──────────────────────────────────────────────────┘  │    │
│  │                                                          │    │
│  │  ┌──────────────────────────────────────────────────┐  │    │
│  │  │                   Models                          │  │    │
│  │  │  - Data Access Layer                             │  │    │
│  │  │  - Database Queries                              │  │    │
│  │  │  - User, Customer, Document, Activity            │  │    │
│  │  └──────────────────────────────────────────────────┘  │    │
│  └────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              ▼ SQL
┌─────────────────────────────────────────────────────────────────┐
│                      DATABASE LAYER                              │
│  ┌────────────────────────────────────────────────────────┐    │
│  │           PostgreSQL Database                           │    │
│  │                                                          │    │
│  │  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐  │    │
│  │  │   users     │  │  customers   │  │  documents   │  │    │
│  │  │             │  │              │  │              │  │    │
│  │  │ - id        │  │ - id         │  │ - id         │  │    │
│  │  │ - email     │  │ - user_id    │  │ - customer_id│  │    │
│  │  │ - password  │  │ - first_name │  │ - file_path  │  │    │
│  │  │ - role      │  │ - last_name  │  │ - doc_type   │  │    │
│  │  │             │  │ - gstin      │  │ - status     │  │    │
│  │  └─────────────┘  └──────────────┘  └──────────────┘  │    │
│  │                                                          │    │
│  │  ┌──────────────────────────────────────────────────┐  │    │
│  │  │         onboarding_activities                     │  │    │
│  │  │  - Activity tracking and audit logs              │  │    │
│  │  └──────────────────────────────────────────────────┘  │    │
│  └────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

### Component Architecture

#### Frontend Architecture

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Navbar.jsx      # Navigation with role-based links
│   │   ├── Loading.jsx     # Loading spinner
│   │   ├── ProtectedRoute.jsx       # Auth guard for routes
│   │   └── AdminProtectedRoute.jsx  # Admin-only route guard
│   │
│   ├── context/            # React Context API
│   │   └── AuthContext.jsx # Global auth state management
│   │
│   ├── pages/              # Page components
│   │   ├── Login.jsx       # Login form with validation
│   │   ├── Register.jsx    # Registration with strong validation
│   │   ├── Dashboard.jsx   # Customer dashboard
│   │   ├── Profile.jsx     # Profile management
│   │   ├── Documents.jsx   # Document upload/management
│   │   └── admin/          # Admin pages
│   │       ├── AdminDashboard.jsx
│   │       ├── UserManagement.jsx
│   │       └── CustomerManagement.jsx
│   │
│   ├── services/           # API service layer
│   │   ├── api.js          # Main API client (Axios)
│   │   └── adminAPI.js     # Admin-specific API client
│   │
│   ├── App.jsx             # Root component with routing
│   └── main.jsx            # Entry point
```

#### Backend Architecture

```
backend/
├── src/
│   ├── config/             # Configuration
│   │   ├── database.js     # PostgreSQL connection pool
│   │   └── jwt.js          # JWT secret & expiration
│   │
│   ├── controllers/        # Business logic
│   │   ├── auth.controller.js      # Login, register, profile
│   │   ├── customer.controller.js  # Customer operations
│   │   ├── document.controller.js  # File upload/download
│   │   └── admin.controller.js     # Admin operations
│   │
│   ├── middleware/         # Express middleware
│   │   ├── auth.middleware.js      # JWT verification
│   │   ├── rbac.middleware.js      # Role-based access control
│   │   ├── validation.middleware.js # Input validation
│   │   └── upload.middleware.js    # File upload (Multer)
│   │
│   ├── models/             # Data access layer
│   │   ├── User.model.js           # User CRUD operations
│   │   ├── Customer.model.js       # Customer CRUD
│   │   ├── Document.model.js       # Document CRUD
│   │   └── OnboardingActivity.model.js # Activity logging
│   │
│   ├── routes/             # API route definitions
│   │   ├── auth.routes.js      # /api/auth/*
│   │   ├── customer.routes.js  # /api/customers/*
│   │   ├── document.routes.js  # /api/documents/*
│   │   └── admin.routes.js     # /api/admin/*
│   │
│   ├── utils/              # Utility functions
│   │   ├── jwt.util.js         # Token generation/verification
│   │   └── password.util.js    # Password hashing/comparison
│   │
│   ├── database/           # Database management
│   │   ├── schema.sql          # Database schema
│   │   ├── migrate.js          # Schema migration script
│   │   ├── migrate-roles.js    # Role migration script
│   │   └── seed-admin.js       # Admin user seeding
│   │
│   └── server.js           # Express app entry point
```

### Data Flow

#### Authentication Flow

```
1. User Login Request
   ↓
2. Frontend: POST /api/auth/login
   ↓
3. Backend: Validate credentials
   ↓
4. Backend: Query user from database
   ↓
5. Backend: Compare password hash (bcrypt)
   ↓
6. Backend: Generate JWT token (if valid)
   ↓
7. Backend: Return { token, user, customer }
   ↓
8. Frontend: Store token in localStorage
   ↓
9. Frontend: Store user/customer in React state
   ↓
10. Frontend: Redirect based on role
    - Admin → /admin/dashboard
    - Broker → /dashboard
```

#### Protected API Request Flow

```
1. Frontend: Make API request
   ↓
2. Axios Interceptor: Add Authorization header
   - "Bearer <JWT_TOKEN>"
   ↓
3. Backend: Extract token from header
   ↓
4. Backend Middleware: Verify JWT signature
   ↓
5. Backend Middleware: Check token expiration
   ↓
6. Backend Middleware: Extract user payload
   ↓
7. Backend Middleware: Attach user to req.user
   ↓
8. Backend RBAC Middleware: Check user role
   ↓
9. Backend Controller: Process request
   ↓
10. Backend: Return response
    ↓
11. Frontend: Handle response
    - Success: Update UI
    - 401: Redirect to login
    - 403: Show access denied
    - Error: Display error message
```

#### File Upload Flow

```
1. User selects file
   ↓
2. Frontend: Validate file
   - Check file size (max 5MB)
   - Check file type (JPEG, PNG, PDF, DOC, DOCX)
   ↓
3. Frontend: Create FormData
   - Append file
   - Append document_type
   ↓
4. Frontend: POST /api/documents/upload
   ↓
5. Backend: Multer middleware processes file
   - Generate unique filename (UUID)
   - Save to /uploads directory
   ↓
6. Backend: Validate document_type
   ↓
7. Backend: Save file metadata to database
   - customer_id
   - document_type
   - file_path
   - file_size
   - mime_type
   ↓
8. Backend: Log activity
   ↓
9. Backend: Return document metadata
   ↓
10. Frontend: Update documents list
```

---

## 🔒 Security

### Authentication & Authorization

#### 1. **JWT (JSON Web Tokens)**

**Implementation:**
```javascript
// Token Generation
const token = jwt.sign(
  {
    userId: user.id,
    email: user.email,
    role: user.role,
    customerId: customer.id
  },
  JWT_SECRET,
  { expiresIn: '24h' }
);
```

**Security Features:**
- ✅ **Signed tokens** - Prevents tampering
- ✅ **Expiration** - Tokens expire after 24 hours
- ✅ **Payload encryption** - Contains user identity and role
- ✅ **Secure secret** - Stored in environment variables

**Token Storage:**
- **Frontend**: `localStorage` (token only)
- **NOT stored**: User data in localStorage (stored in React state)
- **Transmission**: Bearer token in Authorization header

#### 2. **Password Security**

**Hashing Algorithm:** bcryptjs with salt rounds = 10

```javascript
// Password Hashing
const salt = await bcrypt.genSalt(10);
const passwordHash = await bcrypt.hash(password, salt);

// Password Verification
const isValid = await bcrypt.compare(inputPassword, storedHash);
```

**Security Features:**
- ✅ **One-way hashing** - Passwords never stored in plain text
- ✅ **Salt per password** - Protects against rainbow table attacks
- ✅ **Computational cost** - Slow hashing prevents brute force

**Password Requirements (Frontend & Backend):**
- Minimum 6 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

#### 3. **Role-Based Access Control (RBAC)**

**Roles:**
- `broker` - Default role for registered users
- `admin` - Elevated privileges for system administration

**Database Implementation:**
```sql
CREATE TYPE user_role AS ENUM ('broker', 'admin');

CREATE TABLE users (
  role user_role NOT NULL DEFAULT 'broker'
);
```

**Middleware Implementation:**
```javascript
// Authentication Middleware
export function requireAuth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Authentication required' });
  
  const decoded = jwt.verify(token, JWT_SECRET);
  req.user = decoded;
  next();
}

// Authorization Middleware
export function requireRole(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access forbidden' });
    }
    next();
  };
}
```

**Route Protection:**
```javascript
// Admin-only routes
router.use(requireAuth);
router.use(requireAdmin);

// Broker or Admin routes
router.use(requireAuth);
router.use(requireBrokerOrAdmin);
```

#### 4. **Input Validation**

**Frontend Validation:**
- Email format validation
- Password strength requirements
- GSTIN format validation (15 characters, specific pattern)
- Phone number format validation
- Zip code validation (5-6 digits)
- File size validation (max 5MB)
- File type validation (JPEG, PNG, PDF, DOC, DOCX)

**Backend Validation (express-validator):**
```javascript
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('first_name').notEmpty().trim(),
  body('last_name').notEmpty().trim(),
  body('gstin')
    .optional()
    .isLength({ min: 15, max: 15 })
    .matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/),
], validate, authController.register);
```

**Security Benefits:**
- ✅ Prevents SQL injection
- ✅ Prevents XSS attacks
- ✅ Ensures data integrity
- ✅ Provides clear error messages

#### 5. **File Upload Security**

**Multer Configuration:**
```javascript
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: fileFilter,
});
```

**Security Features:**
- ✅ File type whitelist
- ✅ File size limits
- ✅ Unique filename generation (UUID)
- ✅ Isolated storage directory
- ✅ MIME type validation

#### 6. **CORS (Cross-Origin Resource Sharing)**

```javascript
app.use(cors());
```

**Configuration:**
- Allows frontend-backend communication
- In production: Configure specific origins

**Best Practice:**
```javascript
// Production CORS
app.use(cors({
  origin: 'https://yourdomain.com',
  credentials: true
}));
```

#### 7. **SQL Injection Prevention**

**Parameterized Queries:**
```javascript
// ✅ SAFE - Parameterized query
const query = 'SELECT * FROM users WHERE email = $1';
await pool.query(query, [email]);

// ❌ UNSAFE - String concatenation (NEVER DO THIS)
const query = `SELECT * FROM users WHERE email = '${email}'`;
```

**All database queries use parameterized statements.**

#### 8. **Error Handling**

**Security-conscious error messages:**

```javascript
// ❌ Bad - Exposes system details
res.status(500).json({ error: error.stack });

// ✅ Good - Generic message
res.status(500).json({ error: 'Internal server error' });

// Backend logs full error
console.error('Database error:', error);
```

**Error Codes:**
- `400` - Validation errors
- `401` - Authentication required
- `403` - Forbidden (insufficient permissions)
- `404` - Resource not found
- `409` - Conflict (duplicate email/GSTIN)
- `500` - Server error (generic message to client)

#### 9. **Environment Variables**

**Sensitive data in `.env`:**
```bash
DB_HOST=localhost
DB_PORT=5432
DB_NAME=customer_onboarding
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=24h
PORT=3000
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880
```

**Security:**
- ✅ `.env` in `.gitignore`
- ✅ Secrets not committed to version control
- ✅ Different secrets per environment (dev/prod)

#### 10. **Session Security**

**Token Management:**
- Tokens stored in `localStorage` (client-side)
- Tokens expire after 24 hours
- Automatic logout on token expiration
- Manual logout clears token

**Frontend Interceptor:**
```javascript
// Axios response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !isAuthEndpoint) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### Security Checklist

| Security Feature | Implemented | Notes |
|------------------|-------------|-------|
| JWT Authentication | ✅ | 24h expiration |
| Password Hashing | ✅ | bcryptjs, salt rounds = 10 |
| Role-Based Access Control | ✅ | Broker & Admin roles |
| Input Validation (Frontend) | ✅ | Comprehensive validation |
| Input Validation (Backend) | ✅ | express-validator |
| SQL Injection Prevention | ✅ | Parameterized queries |
| XSS Prevention | ✅ | Input sanitization |
| CORS Configuration | ✅ | Configured for dev/prod |
| File Upload Security | ✅ | Type & size restrictions |
| Secure Error Messages | ✅ | No system details exposed |
| Environment Variables | ✅ | .env for secrets |
| HTTPS (Production) | ⚠️ | Configure in deployment |
| Rate Limiting | ⚠️ | Recommended for production |
| Helmet.js | ⚠️ | Recommended for production |

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM v6
- **HTTP Client**: Axios
- **State Management**: React Context API

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: JavaScript (ES Modules)
- **Authentication**: JSON Web Tokens (JWT)
- **Validation**: express-validator
- **File Upload**: Multer
- **Password Hashing**: bcryptjs
- **CORS**: cors package

### Database
- **Database**: PostgreSQL 13+
- **Connection**: node-postgres (pg)
- **Schema Management**: SQL migrations

### Development Tools
- **Backend Dev Server**: nodemon
- **Frontend Dev Server**: Vite
- **Environment Variables**: dotenv

---

## ✨ Features

### Authentication & Authorization
- ✅ User registration with validation
- ✅ Secure login with JWT
- ✅ Password hashing (bcryptjs)
- ✅ Role-based access control (Broker, Admin)
- ✅ Protected routes
- ✅ Auto-logout on token expiration

### Customer Management
- ✅ Multi-step onboarding process
- ✅ Profile management
- ✅ GSTIN validation and storage
- ✅ Personal information management
- ✅ Onboarding status tracking
- ✅ Activity logging

### Document Management
- ✅ Document upload (PDF, images, Word docs)
- ✅ Document type categorization
- ✅ File size validation (5MB max)
- ✅ File type validation
- ✅ Document download
- ✅ Document deletion
- ✅ Verification status tracking

### Admin Dashboard
- ✅ System overview statistics
- ✅ User management
- ✅ Customer management
- ✅ Document verification
- ✅ Role assignment
- ✅ Activity monitoring

### User Experience
- ✅ Responsive design (mobile-friendly)
- ✅ Modern UI with Tailwind CSS
- ✅ Loading states
- ✅ Error handling with user-friendly messages
- ✅ Success feedback with auto-dismiss
- ✅ Real-time validation
- ✅ Smooth animations and transitions

---

## 📁 Project Structure

```
customer-onboarding-mvp/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js
│   │   │   └── jwt.js
│   │   ├── controllers/
│   │   │   ├── admin.controller.js
│   │   │   ├── auth.controller.js
│   │   │   ├── customer.controller.js
│   │   │   └── document.controller.js
│   │   ├── database/
│   │   │   ├── migrate-roles.js
│   │   │   ├── migrate.js
│   │   │   ├── schema.sql
│   │   │   └── seed-admin.js
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js
│   │   │   ├── rbac.middleware.js
│   │   │   ├── upload.middleware.js
│   │   │   └── validation.middleware.js
│   │   ├── models/
│   │   │   ├── Customer.model.js
│   │   │   ├── Document.model.js
│   │   │   ├── OnboardingActivity.model.js
│   │   │   └── User.model.js
│   │   ├── routes/
│   │   │   ├── admin.routes.js
│   │   │   ├── auth.routes.js
│   │   │   ├── customer.routes.js
│   │   │   └── document.routes.js
│   │   ├── utils/
│   │   │   ├── jwt.util.js
│   │   │   └── password.util.js
│   │   └── server.js
│   ├── uploads/           # File upload directory
│   ├── .env              # Environment variables
│   ├── .gitignore
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AdminProtectedRoute.jsx
│   │   │   ├── Loading.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   │   ├── AdminDashboard.jsx
│   │   │   │   ├── CustomerDetail.jsx
│   │   │   │   ├── CustomerManagement.jsx
│   │   │   │   └── UserManagement.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Documents.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── Register.jsx
│   │   ├── services/
│   │   │   ├── adminAPI.js
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── public/
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── .gitignore
├── RBAC_GUIDE.md
├── RBAC_SUMMARY.md
└── README.md
```

---

## 🚀 Setup & Installation

### Prerequisites

- **Node.js** 16+ and npm
- **PostgreSQL** 13+
- **Git**

### 1. Clone Repository

```bash
git clone <repository-url>
cd customer-onboarding-mvp
```

### 2. Database Setup

#### Using Docker (Recommended)

```bash
# Start PostgreSQL container
docker run --name customer-onboarding-db \
  -e POSTGRES_PASSWORD=yourpassword \
  -e POSTGRES_DB=customer_onboarding \
  -p 5432:5432 \
  -d postgres:13
```

#### Manual PostgreSQL Setup

```bash
# Create database
psql -U postgres
CREATE DATABASE customer_onboarding;
\q
```

### 3. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
DB_HOST=localhost
DB_PORT=5432
DB_NAME=customer_onboarding
DB_USER=postgres
DB_PASSWORD=yourpassword
JWT_SECRET=your_secret_key_change_this_in_production
JWT_EXPIRES_IN=24h
PORT=3000
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880
EOF

# Run database migrations
npm run migrate

# (Optional) Migrate roles if upgrading from old schema
npm run migrate:roles

# Create admin user
npm run seed:admin admin@example.com Admin@123

# Start backend server
npm start
# OR for development with auto-reload
npm run dev
```

**Backend will run on:** `http://localhost:3000`

### 4. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Create .env file (optional, uses default)
cat > .env << EOF
VITE_API_URL=http://localhost:3000/api
EOF

# Start frontend development server
npm run dev
```

**Frontend will run on:** `http://localhost:5173`

### 5. Access Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **Health Check**: http://localhost:3000/health

### Default Credentials

**Admin User (created via seed script):**
- Email: `admin@example.com`
- Password: `Admin@123`

**Test Broker (register via UI):**
- Any valid email
- Password meeting requirements

---

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication

All authenticated endpoints require:
```
Authorization: Bearer <JWT_TOKEN>
```

### Endpoints

#### **Authentication** (`/api/auth`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | No | Register new user |
| POST | `/auth/login` | No | Login user |
| GET | `/auth/profile` | Yes | Get current user profile |

**Register Request:**
```json
{
  "email": "user@example.com",
  "password": "Password123",
  "first_name": "John",
  "last_name": "Doe",
  "gstin": "22AAAAA0000A1Z5"  // Optional
}
```

**Login Request:**
```json
{
  "email": "user@example.com",
  "password": "Password123"
}
```

**Login Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "role": "broker"
  },
  "customer": {
    "id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "onboarding_status": "pending",
    "onboarding_step": 1
  }
}
```

#### **Customer** (`/api/customers`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/customers/profile` | Yes | Get customer profile |
| PUT | `/customers/profile` | Yes | Update customer profile |
| GET | `/customers/status` | Yes | Get onboarding status |
| PUT | `/customers/status` | Yes | Update onboarding step |
| GET | `/customers/activities` | Yes | Get customer activities |

**Update Profile Request:**
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "gstin": "22AAAAA0000A1Z5",
  "phone": "+91-1234567890",
  "date_of_birth": "1990-01-01",
  "address": "123 Main St",
  "city": "Mumbai",
  "state": "Maharashtra",
  "zip_code": "400001",
  "country": "India"
}
```

#### **Documents** (`/api/documents`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/documents/upload` | Yes | Upload document |
| GET | `/documents` | Yes | Get all user documents |
| GET | `/documents/:id` | Yes | Get specific document |
| GET | `/documents/:id/download` | Yes | Download document |
| DELETE | `/documents/:id` | Yes | Delete document |

**Upload Document Request:**
```
Content-Type: multipart/form-data

document: [File]
document_type: "id_proof" | "address_proof" | "income_proof" | "photo" | "other"
```

#### **Admin** (`/api/admin`)

**All admin endpoints require `admin` role.**

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/admin/overview` | Admin | Dashboard statistics |
| GET | `/admin/users` | Admin | Get all users |
| PUT | `/admin/users/:id/role` | Admin | Update user role |
| GET | `/admin/customers` | Admin | Get all customers |
| GET | `/admin/customers/:id` | Admin | Get customer by ID |
| PUT | `/admin/customers/:id/status` | Admin | Update customer status |
| GET | `/admin/documents` | Admin | Get all documents |
| PUT | `/admin/documents/:id/verify` | Admin | Update document status |
| GET | `/admin/activities` | Admin | Get all activities |

**Update User Role Request:**
```json
{
  "role": "admin"  // or "broker"
}
```

**Update Document Status Request:**
```json
{
  "verification_status": "approved",  // or "rejected", "pending"
  "notes": "Document verified successfully"
}
```

### Error Responses

```json
{
  "error": "Error message",
  "details": [
    {
      "field": "email",
      "message": "Valid email is required"
    }
  ]
}
```

---

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'broker',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Customers Table
```sql
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    gstin VARCHAR(15) UNIQUE,
    phone VARCHAR(20),
    date_of_birth DATE,
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    zip_code VARCHAR(20),
    country VARCHAR(100),
    onboarding_status VARCHAR(50) DEFAULT 'pending',
    onboarding_step INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Documents Table
```sql
CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id) ON DELETE CASCADE,
    document_type VARCHAR(100) NOT NULL,
    document_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    file_size INTEGER,
    mime_type VARCHAR(100),
    verification_status VARCHAR(50) DEFAULT 'pending',
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    verified_at TIMESTAMP,
    notes TEXT
);
```

### Onboarding Activities Table
```sql
CREATE TABLE onboarding_activities (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id) ON DELETE CASCADE,
    activity_type VARCHAR(100) NOT NULL,
    activity_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Entity Relationships

```
users (1) ──────< (1) customers
              │
              └──< (many) documents
              │
              └──< (many) onboarding_activities
```

---

## 👥 User Roles

### Broker (Default Role)
**Capabilities:**
- Register and login
- Manage own profile
- Update personal information
- Upload/download/delete own documents
- View onboarding status
- Track activities

**Access:**
- `/dashboard` - Personal dashboard
- `/profile` - Profile management
- `/documents` - Document management

### Admin (Elevated Role)
**Capabilities:**
- All broker capabilities
- **PLUS:**
- View all users and customers
- Update user roles (promote/demote)
- Verify documents
- Update customer onboarding status
- View system-wide statistics
- Monitor all activities

**Access:**
- `/admin/dashboard` - Admin dashboard
- `/admin/users` - User management
- `/admin/customers` - Customer management
- **PLUS:** All broker routes

### Creating Admin Users

**Option 1: Seed Script**
```bash
npm run seed:admin admin@example.com AdminPassword123
```

**Option 2: Promote Existing User**
```bash
# Via Admin Dashboard UI after logging in as admin
# Go to User Management → Edit User → Change Role to "admin"
```

**Option 3: Direct Database**
```sql
UPDATE users SET role = 'admin' WHERE email = 'user@example.com';
```

---

## 💻 Development

### Running in Development Mode

**Backend:**
```bash
cd backend
npm run dev  # Uses nodemon for auto-reload
```

**Frontend:**
```bash
cd frontend
npm run dev  # Vite hot module replacement
```

### Environment Variables

**Backend `.env`:**
```bash
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=customer_onboarding
DB_USER=postgres
DB_PASSWORD=yourpassword

# JWT
JWT_SECRET=your_secret_key_minimum_32_characters_long
JWT_EXPIRES_IN=24h

# Server
PORT=3000
NODE_ENV=development

# File Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880
```

**Frontend `.env`:**
```bash
VITE_API_URL=http://localhost:3000/api
```

### Scripts

**Backend:**
```bash
npm start              # Start server
npm run dev            # Development with nodemon
npm run migrate        # Run database migrations
npm run migrate:roles  # Migrate user roles to ENUM
npm run seed:admin     # Create admin user
npm test              # Run tests (if configured)
```

**Frontend:**
```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
```

### Code Style

- **ES Modules** throughout the backend
- **React Hooks** for state management
- **Functional components** in React
- **Arrow functions** for consistency
- **Async/await** for asynchronous operations
- **Destructuring** for cleaner code

---

## 🚢 Production Deployment

### Backend Deployment

1. **Set Production Environment Variables:**
```bash
NODE_ENV=production
JWT_SECRET=<strong-random-secret>
DB_HOST=<production-db-host>
DB_PASSWORD=<secure-password>
```

2. **Security Enhancements:**

Install additional security packages:
```bash
npm install helmet express-rate-limit
```

Update `server.js`:
```javascript
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// Security headers
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Specific CORS origin
app.use(cors({
  origin: 'https://yourdomain.com',
  credentials: true
}));
```

3. **Database Connection Pooling:**
```javascript
const pool = new Pool({
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  ssl: {
    rejectUnauthorized: false // For production databases
  }
});
```

4. **Enable HTTPS:**
- Use reverse proxy (Nginx, Apache)
- Or configure Express with SSL certificates

5. **Process Management:**
```bash
# Use PM2 for process management
npm install -g pm2
pm2 start src/server.js --name customer-onboarding
pm2 startup
pm2 save
```

### Frontend Deployment

1. **Build Production Bundle:**
```bash
npm run build
```

2. **Deploy Static Files:**
- Upload `dist/` directory to:
  - **Vercel**, **Netlify**, **AWS S3 + CloudFront**
  - Or serve via Nginx/Apache

3. **Configure Environment:**
```bash
VITE_API_URL=https://api.yourdomain.com/api
```

4. **Nginx Configuration Example:**
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    root /var/www/customer-onboarding/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Production Checklist

- [ ] Environment variables secured
- [ ] HTTPS enabled
- [ ] Database backups configured
- [ ] CORS configured for specific origin
- [ ] Rate limiting enabled
- [ ] Helmet.js security headers added
- [ ] File upload directory permissions set
- [ ] Logs configured and monitored
- [ ] Error tracking (Sentry, etc.) setup
- [ ] Health check endpoint monitored
- [ ] Database indexes optimized
- [ ] CDN configured for static assets

---

## 📝 License

This project is proprietary and confidential.

---

## 👨‍💻 Development Team

For questions or support, contact the development team.

---

## 📊 Performance Considerations

- **Database**: Connection pooling (max 20 connections)
- **File Uploads**: Streamed, not buffered in memory
- **Frontend**: Code splitting with React.lazy()
- **API**: Pagination for large datasets
- **Caching**: Consider Redis for session management

---

## 🔮 Future Enhancements

- [ ] Email verification
- [ ] Password reset functionality
- [ ] Two-factor authentication (2FA)
- [ ] Real-time notifications (WebSockets)
- [ ] Advanced search and filtering
- [ ] Data export (CSV, PDF)
- [ ] Audit log dashboard
- [ ] Multi-language support (i18n)
- [ ] Dark mode theme
- [ ] Mobile app (React Native)

---

**Built with ❤️ using React, Node.js, Express, and PostgreSQL**
